import { useContext, useEffect, useRef, useState } from "react"
import Button from "../shared/Button"
import Card from "../shared/Card"
import Context from "../../Context"
import { useNavigate, useParams } from "react-router-dom"
import { catchError } from "../../lib/catchError"
import HttpInterceptor from "../../lib/HttpInterceptor"
import { Modal, notification } from 'antd'
import socket from "../../lib/socket"
import type { callType, onAnswerInterface, onCandidateInterface, onOfferInterface } from "./Video"



const AudioChat = () => {
    const [open, setOpen] = useState(false)
    const { id } = useParams()
    const [isMic, setIsMic] = useState(false)
    const [notify, notifyUi] = notification.useNotification()
    const navigate = useNavigate()

    const { session, liveActiveSession, sdp, setSdp } = useContext(Context)

    const localAudio = useRef<HTMLAudioElement | null>(null)
    const remoteAudio = useRef<HTMLAudioElement | null>(null)
    const loaclStream = useRef<MediaStream | null>(null)
    const rtc = useRef<RTCPeerConnection | null>(null)
    const audio = useRef<HTMLAudioElement | null>(null)
    const [status, setStatus] = useState<callType>("pending")

    const config = {
        iceServers: [
            {
                urls: "stun:stun.l.google.com:19302"
            }
        ]
    }

    const stopAudio = () => {

        if (!audio.current) {
            return
        }

        const player = audio.current;
        player.pause();
        player.currentTime = 0;


    }


    const redirectOnCallEnd = () => {
        setOpen(false)
        navigate("/app")
    }

    const playAudio = (src: string, loop: boolean = false) => {
        stopAudio()
        if (!audio.current) {
            audio.current = new Audio()
        }

        const player = audio.current
        player.src = src
        player.loop = loop
        player.load()
        player.play()
    }


    const toggleMic = async () => {
        try {
            if (!loaclStream.current && !isMic) {
                setIsMic(true)
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                if (localAudio.current) {
                    localAudio.current.srcObject = stream
                    localAudio.current.play()
                }
                loaclStream.current = stream
            }

            else {

                loaclStream.current?.getTracks().forEach((track) => {
                    track.stop()
                })
                if (localAudio.current) {
                    localAudio.current?.pause()
                    localAudio.current.srcObject = null;
                }
                loaclStream.current = null
                setIsMic(false)
            }


        } catch (error) {
            catchError(error)
        }
    }
    const connection = async () => {
        try {
            // const { data } = await HttpInterceptor.get("/twilio/turn-server")
            // rtc.current = new RTCPeerConnection({ iceServers: data })
            rtc.current = new RTCPeerConnection(config)
            const loaclStreaming = loaclStream.current

            if (!loaclStreaming) {
                return
            }

            loaclStreaming.getTracks().forEach((track) => {
                rtc.current?.addTrack(track, loaclStreaming)
            })

            rtc.current.onicecandidate = (e) => {
                if (e.candidate) {
                    socket.emit("candidate", { candidate: e.candidate, to: id })
                }

            }

            rtc.current.onconnectionstatechange = () => {
                console.log(rtc.current?.connectionState);

            }

            rtc.current.ontrack = (e) => {
                if (e && remoteAudio.current) {
                    const remoteStream = e.streams[0]
                    remoteAudio.current.srcObject = remoteStream
                }

            }

        } catch (error) {
            catchError(error)
        }
    }


    const endStreaming = () => {
        loaclStream.current?.getTracks().forEach((track) => {
            track.stop()
        })

        if (localAudio.current) {
            localAudio.current.srcObject = null
        }

        if (remoteAudio.current) {
            remoteAudio.current.srcObject = null
        }
    }

    const startCall = async () => {
        try {
            await connection()

            if (!rtc.current) {
                return
            }

            const offer = await rtc.current.createOffer()
            await rtc.current.setLocalDescription(offer)

            notify.open({
                title: <h1 className="capitalize font-medium">{liveActiveSession.fullname}</h1>,
                description: 'Calling',
                duration: 30,
                placement: 'bottomRight',
                onClose: stopAudio,
                actions: [
                    <button key="end" className="bg-rose-300 px-3 py-1 rounded text-white hover:bg-rose-500" onClick={endCallOnLocal} >End call</button>
                ]
            })
            playAudio('/sound/ring.mp3', true)
            setStatus('calling')
            socket.emit("offer", { offer, to: id, from: session, type: 'audio' })
        } catch (error) {
            catchError(error)
        }
    }


    const acceptCall = async (payload: onOfferInterface) => {
        try {
            setSdp(null)
            await connection()

            if (!rtc.current) {
                return
            }

            const offer = new RTCSessionDescription(payload.offer)
            await rtc.current.setRemoteDescription(offer)

            const answer = await rtc.current.createAnswer()
            await rtc.current.setLocalDescription(answer)

            notify.destroy()
            setStatus('talking')
            stopAudio()
            socket.emit("answer", { answer, to: id })


        } catch (error) {
            catchError(error)
        }
    }





    const endCallOnLocal = () => {
        setStatus('end')
        playAudio('/sound/reject.mp3')
        notify.destroy()
        socket.emit("end", { to: id })
        endStreaming()
        setOpen(true)
    }





    useEffect(() => {
        toggleMic()
    }, [])



    useEffect(() => {
        if (sdp) {
            notify.destroy()
            onOffer(sdp)
        }
    }, [sdp])



    // Event listner
    const onOffer = (payload: onOfferInterface) => {
        try {
            notify.open({
                title: <h1 className="capitalize font-semibold">{payload.from.fullname}</h1>,
                description: "Incoming Call",
                duration: 30,
                placement: 'bottomRight',
                actions: [
                    <div key="call-actions" className="space-x-2" >
                        <button className="bg-green-400 mr-3 hover:bg-green-500 px-6 py-2 font-medium rounded text-white" onClick={() => acceptCall(payload)} >Accept</button>
                        <button className="bg-rose-500 hover:bg-rose-600 px-6 py-2 rounded text-white font-medium" onClick={endCallOnLocal} >Reject</button>
                    </div>
                ]
            })

            playAudio('/sound/ring.mp3')
            setStatus('incoming')
        } catch (error) {
            catchError(error)
        }

    }


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
            await rtc.current.setRemoteDescription(answer);
            setStatus('talking')
            stopAudio()
            notify.destroy()
        } catch (error) {
            catchError(error)
        }
    }


    const onEndCallRemote = () => {
        setStatus('end')
        notify.destroy()
        playAudio('/sound/reject.mp3')
        endStreaming()
        setOpen(true)
    }



    useEffect(() => {

        socket.on("offer", onOffer)
        socket.on('answer', onAnswer)
        socket.on("candidate", onConnect)
        socket.on("end", onEndCallRemote)


        return () => {
            socket.off('offer', onOffer)
            socket.off('answer', onAnswer)
            socket.off("candidate", onConnect)
            socket.off("end", onEndCallRemote)

        }

    }, [])

    useEffect(() => {
        if (!liveActiveSession) {
            navigate("/app")
        }
    }, [liveActiveSession, navigate])


    return (
        <div className="space-y-8">

            <div className="grid grid-cols-2 gap-4">

                <Card title={session.fullname}>
                    <audio hidden ref={localAudio} muted playsInline />
                    <audio hidden ref={remoteAudio} autoPlay playsInline ></audio>
                    <div className="flex flex-col items-center">
                        <img src={session.image || "/images/avt.jpg"} alt="avt" className="h-40 w-40 rounded-full object-cover" />
                    </div>
                </Card>

                <Card title={liveActiveSession.fullname}>
                    <div className="flex flex-col items-center">
                        <img src={liveActiveSession.image || "/images/avt.jpg"} alt="avt" className="h-40 w-40 rounded-full object-cover" />
                    </div>
                </Card>

            </div>

            <div className="flex justify-between items-center">

                <div className="space-x-3">

                    <button onClick={toggleMic} className="transition-all duration-150 bg-amber-500 text-white w-12 h-12 rounded-full hover:bg-amber-400 hover:text-white">
                        {
                            isMic ?
                                <i className="ri-mic-fill"></i>
                                :
                                <i className="ri-mic-off-fill"></i>

                        }
                    </button>

                </div>

                {
                    (status === "pending" || status === "end") &&
                    <Button onClick={startCall} type="success" icon="phone-line">Start Call</Button>
                }
                {
                    (status === "talking" || status === "calling") &&
                    <Button type="danger" icon="phone-line" onClick={endCallOnLocal}>End Call</Button>
                }

            </div>
            {notifyUi}
            <Modal open={open} footer={null} centered closable onCancel={redirectOnCallEnd}>
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-semibold">Call Ended</h1>

                    <Button icon="arrow-left-line" type="danger" onClick={redirectOnCallEnd}> Thank You</Button>


                </div>
            </Modal>
        </div>
    )
}

export default AudioChat
