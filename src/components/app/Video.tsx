import { useContext, useEffect, useRef, useState } from "react"
import { catchError } from "../../lib/catchError"
import Button from "../shared/Button"
import Context from "../../Context"
import toast from "react-hot-toast"
import socket from "../../lib/socket"
import { useParams } from "react-router-dom"
import { notification } from "antd"
import useNotification from "antd/es/notification/useNotification"

const config = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        }
    ]
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


    const [isVideoSharing, setIsVideoSharing] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false)
    const [isMic, setIsMic] = useState(false)

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
            console.log(e.candidate);

        }

        rtc.current.onconnectionstatechange = (e) => {
            console.log(rtc.current?.connectionState);

        }

        rtc.current.ontrack = () => {
            console.log("someting is coming from remote user");

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

            socket.emit("offer", {
                offer,
                to: id

            })

        } catch (error) {
            catchError(error)
        }
    }

    const endCall = () => {
        try {
            alert()
        } catch (error) {
            catchError(error)
        }
    }

    const onOffer = (payload: any) => {
        notification.open({
            message: "Aditya kawade",
            description: "Incoming Call",
            duration: 30,
            placement:'bottomRight'
        })

    }

    useEffect(() => {
        socket.on("offer", onOffer)


        return () => {
            socket.off("offer", onOffer)
        }
    }, [])

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
                    <Button type="success" icon="phone-line" onClick={startCall}>Start</Button>
                    <Button type="danger" icon="close-circle-fill" onClick={endCall}>End</Button>
                </div>
            </div>
            {notifyUi}
        </div>
    )
}

export default Video
