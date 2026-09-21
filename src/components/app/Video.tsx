import { useContext, useEffect, useRef, useState } from "react"
import { catchError } from "../../lib/catchError"
import Button from "../shared/Button"
import Context from "../../Context"
import toast from "react-hot-toast"
import socket from "../../lib/socket"
import { useParams } from "react-router-dom"
import useNotification from "antd/es/notification/useNotification"

const config = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        }
    ]
}


interface onOfferInterface {
    offer: RTCSessionDescriptionInit;
    from: string
}

interface onAnswerInterface {
    answer: RTCSessionDescriptionInit;
    from: string
}



interface onCandidateInterface {
    candidate: RTCIceCandidateInit
    from: string
}

type callType = "pending" | "incoming" | "calling" | "talking" | "end"

const getCallTiming = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
    }

    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
}

const Video = () => {

    const { session } = useContext(Context)
    const { id } = useParams()
    const [notify, notifyUi] = useNotification()

    const loacalVideoRef = useRef<HTMLVideoElement | null>(null)
    const localVideoContainerRef = useRef<HTMLDivElement | null>(null)
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null)
    const remoteVideoContainerRef = useRef<HTMLDivElement | null>(null)
    const localStreamRef = useRef<MediaStream | null>(null)
    const rtc = useRef<RTCPeerConnection | null>(null)
    const audio = useRef<HTMLAudioElement | null>(null)


    const [isVideoSharing, setIsVideoSharing] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false)
    const [isMic, setIsMic] = useState(false)
    const [status, setStatus] = useState<callType>("pending")
    const [timer, setTimer] = useState(0)



    const toggleScreen = async () => {
        try {

            const localVideo = loacalVideoRef.current

            if (!localVideo) {
                return
            }

            if (!isScreenSharing) {

                const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })

                localVideo.srcObject = stream
                localStreamRef.current = stream
                setIsScreenSharing(true)
            }
            else {
                const localStream = localStreamRef.current
                if (!localStream) {
                    return
                }

                localStream.getTracks().forEach((track) => {
                    track.stop()
                })

                // Remove stream from video element
                localVideo.srcObject = null

                // Clear ref
                localStreamRef.current = null

                setIsScreenSharing(false)
            }

        } catch (error) {
            catchError(error)
        }
    }


    const toggleMic = () => {
        try {
            const localStream = localStreamRef.current

            if (!localStream) {
                return
            }

            const audioTrack = localStream.getTracks().find((tracks) => tracks.kind === "audio")
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled
                setIsMic(audioTrack.enabled)
            }

        } catch (error) {
            catchError(error)
        }
    }

    const toggleVideo = async () => {
        try {

            const localVideo = loacalVideoRef.current

            if (!localVideo) {
                return
            }

            if (!isVideoSharing) {

                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

                localVideo.srcObject = stream
                localStreamRef.current = stream
                setIsVideoSharing(true)
                setIsMic(true)
            }
            else {

                const localStream = localStreamRef.current
                if (!localStream) {
                    return
                }

                localStream.getTracks().forEach((track) => {
                    track.stop()
                })

                // Remove stream from video element
                localVideo.srcObject = null

                // Clear ref
                localStreamRef.current = null

                setIsVideoSharing(false)
                setIsMic(false)
            }


        } catch (error) {
            catchError(error)
        }
    }

    const toggleFullScreen = (type: 'local' | 'remote') => {

        if (!isVideoSharing && !isScreenSharing) {
            return toast("⚠️ please start your video first", { position: "top-center", duration: 1000 })
        }
        const videoContainer = type === "local" ? localVideoContainerRef.current : remoteVideoContainerRef.current

        if (!videoContainer) {
            return
        }


        if (!document.fullscreenElement) {
            videoContainer.requestFullscreen()
        }
        else {
            document.exitFullscreen()
        }

    }


    const webRtcConnection = () => {
        rtc.current = new RTCPeerConnection(config)


        const localStream = localStreamRef.current

        if (!rtc || !localStream) {
            return
        }

        rtc.current.onicecandidate = (e) => {

            if (e.candidate) {
                socket.emit("candidate", { candidate: e.candidate, to: id })
            }

        }

        rtc.current.onconnectionstatechange = (e) => {
            console.log(rtc.current?.connectionState);

        }

        rtc.current.ontrack = (e) => {
            const remoteStream = e.streams[0]
            const remoteVideo = remoteVideoRef.current



            if (!remoteStream || !remoteVideo) {
                return
            }

            remoteVideo.srcObject = remoteStream


            const videoTracks = remoteStream.getVideoTracks()[0]
            if (videoTracks) {
                videoTracks.onmute = () => {
                    remoteVideo.style.display = "none"

                }

                videoTracks.onunmute = () => {
                    remoteVideo.style.display = "block"

                }


                videoTracks.onended = () => {
                    remoteVideo.srcObject = null

                }
            }

        }

        localStream.getTracks().forEach((tracks) => {
            rtc.current?.addTrack(tracks, localStream)
        })

    }

    const startCall = async () => {
        try {
            if (!isVideoSharing && !isScreenSharing) {
                return toast("Start your video first", { duration: 2000 })
            }

            webRtcConnection()

            if (!rtc.current) {
                return
            }


            const offer = await rtc.current.createOffer()
            console.log(offer);

            await rtc.current.setLocalDescription(offer)
            setStatus("calling")
            notify.open({
                message: "Aditya kawade",
                description: "Calling",
                duration: 30,
                placement: 'bottomRight',
                actions: [
                    <button key="end" className="bg-rose-300 px-3 py-1 rounded text-white hover:bg-rose-500" onClick={endCall}>End call</button>
                ]

            })
            socket.emit("offer", {
                offer,
                to: id

            })

        } catch (error) {
            catchError(error)
        }
    }

    const accept = async (payload: onOfferInterface) => {
        try {

            webRtcConnection()
            if (!rtc.current) {
                return
            }
            const offer = new RTCSessionDescription(payload.offer)
            await rtc.current.setRemoteDescription(offer)

            const answer = await rtc.current.createAnswer()
            await rtc.current.setLocalDescription(answer)

            setStatus("talking")
            notify.destroy()
            socket.emit("answer", { answer, to: id })

        } catch (error) {
            catchError(error)
        }
    }


    const endCall = () => {
        setStatus("end")
        socket.emit("end", { to: id })
    }

    const onOffer = (payload: onOfferInterface) => {

        notify.open({
            message: "Aditya kawade",
            description: "Incoming Call",
            duration: 30,
            placement: 'bottomRight',
            actions: [
                <div className="space-x-2">
                    <button className="bg-green-400 hover:bg-green-500 px-3 py-1 rounded text-white" onClick={() => accept(payload)}>Accept</button>
                    <button className="bg-red-400 hover:bg-red-500 px-3 py-1 rounded text-white" onClick={() => endCall()}>Reject</button>
                </div>
            ]
        })

    }


    // CONNECT BOTH USER VIA WEBRTC
    const onConnect = async (payload: onCandidateInterface) => {
        try {

            if (!rtc.current) {
                return
            }
            const candidate = new RTCIceCandidate(payload.candidate)
            await rtc.current.addIceCandidate(candidate)
        } catch (error) {
            catchError(error)
        }
    }

    const onAnswer = async (payload: onAnswerInterface) => {
        try {
            if (!rtc.current) {
                return
            }
            const answer = new RTCSessionDescription(payload.answer)
            await rtc.current.setRemoteDescription(answer)
            setStatus("talking")
            notify.destroy()
        } catch (error) {
            catchError(error)
        }
    }


    const onEnd = () => {
        endCall()

    }


    useEffect(() => {
        toggleVideo()
        socket.on("offer", onOffer)
        socket.on("candidate", onConnect)
        socket.on("answer", onAnswer)
        socket.on("end", onEnd)

        return () => {
            socket.off("offer", onOffer)
            socket.off("candidate", onConnect)
            socket.off("answer", onAnswer)
            socket.off("end", onEnd)
        }
    }, [])


    useEffect(() => {

        let interval: any
        if (status === "pending") {
            return
        }


        if (!audio.current) {
            clearInterval(interval)
            audio.current = new Audio()
        }

        if (status === "calling" || status === "incoming") {
            clearInterval(interval)
            audio.current.pause()
            audio.current.src = "/sound/ring.mp3"
            audio.current.currentTime = 0
            audio.current.load()
            audio.current.play()
        }

        if (status === "talking") {
            clearInterval(interval)
            audio.current.pause()
            audio.current.currentTime = 0
            interval = setInterval(() => {
                setTimer((prev) => prev + 1)
            }, 1000)

        }

        if (status === "end") {
            clearInterval(interval)
            audio.current.pause()
            audio.current.src = "/sound/reject2.mp3"
            audio.current.currentTime = 0
            audio.current.load()
            audio.current.play()
            notify.destroy()
        }


        return () => {
            if (audio.current) {
                audio.current.pause()
                audio.current.currentTime = 0
                audio.current = null
            }
            clearInterval(interval)
        }

    }, [status])

    return (
        <div className="space-y-8">

            <div ref={remoteVideoContainerRef} className="bg-black w-full h-0 relative pb-[56.25%] rounded-xl">
                <video ref={remoteVideoRef} className=" absolute top-0 left-0 w-full h-full object-cover" autoPlay></video>
                <button className="absolute bottom-5 left-5 text-xs text-white  bg-black/70 py-1 px-2.5 rounded-lg">Aditya kawade</button>
                <button onClick={() => toggleFullScreen("remote")} className="absolute bottom-5 right-5 text-xs text-white bg-white/10 py-1 px-2.5 rounded-lg hover:scale-125 transition duration-200">
                    <i className="ri-fullscreen-line"></i>
                </button>
            </div>


            <div className="grid grid-cols-3 gap-4">


                <div ref={localVideoContainerRef} className="bg-black w-full h-0 relative pb-[56.25%] rounded-xl">
                    <video ref={loacalVideoRef} className="object-cover absolute top-0 left-0 w-full h-full" autoPlay></video>
                    <button className="absolute bottom-2 left-2 text-xs text-white  bg-black/70 py-1 px-2.5 rounded-lg capitalize">{session && session.fullname}</button>
                    <button onClick={() => toggleFullScreen("local")} className="absolute bottom-2 right-2 text-xs text-white bg-white/10 py-1 px-2.5 rounded-lg hover:scale-125 transition duration-200">
                        <i className="ri-fullscreen-line"></i>
                    </button>
                </div>


                <Button type="primary" icon="user-add-fill">Add</Button>


            </div>


            <div className="flex justify-between items-center">
                <div className="space-x-3">
                    <button onClick={toggleVideo} className={`transition-all duration-150 ${isVideoSharing ? "bg-green-500" : "bg-green-300"} text-white  w-12 h-12 rounded-full hover:bg-green-400 hover:text-white`}>
                        {isVideoSharing ?
                            <i className="ri-video-on-ai-fill"></i>
                            :
                            <i className="ri-video-off-fill"></i>
                        }
                    </button>


                    <button onClick={toggleMic} className="transition-all duration-150 bg-amber-500 text-white w-12 h-12 rounded-full hover:bg-amber-400 hover:text-white">
                        {
                            isMic ?
                                <i className="ri-mic-fill"></i>
                                :
                                <i className="ri-mic-off-fill"></i>
                        }
                    </button>

                    <button onClick={toggleScreen} className={`transition-all duration-150 ${isScreenSharing ? "bg-indigo-500" : "bg-indigo-300"} text-white w-12 h-12 rounded-full hover:bg-indigo-400 hover:text-white`}>
                        {
                            isScreenSharing ?
                                <i className="ri-tv-2-fill"></i>
                                :
                                <i className="ri-chat-off-fill"></i>
                        }
                    </button>



                </div>

                <div className="space-x-4">

                    {
                        status === "talking" &&
                        <label>{getCallTiming(timer)}</label>
                    }


                    {
                        (status === "pending" || status === "end") &&

                        <Button type="success" icon="phone-line" onClick={startCall}>Start</Button>
                    }



                    {
                        (status === "talking") &&

                        <Button type="danger" icon="close-circle-line" onClick={endCall}>End</Button>
                    }

                </div>
            </div>
            {notifyUi}
        </div>
    )
}

export default Video
