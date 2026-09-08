import Card from "../../shared/Card"
import socket from "../../../lib/socket"
import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Context from "../../../Context"


const FriendsOnline = () => {

    const [onlineUsers, setOnlineUsers] = useState([])
    const { session } = useContext(Context)


    const onlineHandler = (user: any) => {
        console.log(user);

        setOnlineUsers(user)
    }

    useEffect(() => {
        socket.on("online", onlineHandler)

        socket.emit("get-online")

        return () => {
            socket.off("online", onlineHandler)
        }
    }, [])



    return (
        <Card title="Online Friend">
            <div className="space-y-6">
                {
                    session && onlineUsers.filter((item: any) => item._id !== session._id).map((item: any, index) => (
                        <div key={index} className="flex">
                            <div className="flex gap-3">
                                <img src="/images/avt.jpg" alt="" className="w-12 h-12 rounded-full object-cover" />
                                <div >
                                    <h1 className="font-medium capitalize">{item.fullname}</h1>
                                    <div className="flex items-center gap-4">
                                        <label className={` capitalize text-[10px] font-medium text-green-400 `}>online</label>


                                        <Link to={`/app/chat/${item._id}`}>
                                            <i className="ri-chat-ai-line text-rose-400"></i>
                                        </Link>

                                        <Link to="/app/chat">
                                            <i className="ri-phone-line text-amber-400"></i>
                                        </Link>

                                        <Link to="/app/chat">
                                            <i className="ri-video-on-ai-line text-green-400"></i>
                                        </Link>


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
