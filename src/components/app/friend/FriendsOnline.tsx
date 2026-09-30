import Card from "../../shared/Card"
import socket from "../../../lib/socket"
import { useContext, useEffect, useState } from "react"

import Context from "../../../Context"
import { useNavigate } from "react-router-dom"


const FriendsOnline = () => {
    const navigate = useNavigate()
    const [onlineUsers, setOnlineUsers] = useState([])
    const { session, setLiveActiveSession } = useContext(Context)


    const onlineHandler = (user: any) => {


        setOnlineUsers(user)
    }

    useEffect(() => {
        socket.on("online", onlineHandler)

        socket.emit("get-online")

        return () => {
            socket.off("online", onlineHandler)
        }
    }, [])



    const generateActiveSession = (url: string, user: any) => {
        setLiveActiveSession(user)
        navigate(url)

    }




    return (
        <Card title="Online Friend">
            <div className="space-y-6">
                {
                    session && onlineUsers.filter((item: any) => item._id !== session._id).map((item: any, index) => (
                        <div key={index} className="flex">
                            <div className="flex gap-3">
                                <img src={item.image || "/images/avt.jpg"} alt="" className="w-12 h-12 rounded-full object-cover" />
                                <div >
                                    <h1 className="font-medium capitalize">{item.fullname}</h1>
                                    <div className="flex items-center gap-4">
                                        <label className={` capitalize text-[10px] font-medium text-green-400 `}>online</label>



                                        <button className="hover:cursor-pointer" onClick={() => generateActiveSession(`/app/chat/${item._id}`, item)}>
                                            <i className="ri-chat-ai-line text-rose-400"></i>

                                        </button>


                                        <button className="hover:cursor-pointer" onClick={() => generateActiveSession(`/app/audio-chat/${item._id}`, item)}>

                                            <i className="ri-phone-line text-amber-400"></i>
                                        </button>

                                        <button className="hover:cursor-pointer" onClick={() => generateActiveSession(`/app/video-chat/${item._id}`, item)}>

                                            <i className="ri-video-on-ai-line text-green-400"></i>
                                        </button>



                                    </div>
                                </div>

                            </div>
                        </div>
                    ))
                }
            </div>
        </Card >
    )
}

export default FriendsOnline
