import Avatar from "../shared/Avatar"
import Button from "../shared/Button"
import Input from "../shared/Input"
import socket from "../../lib/socket"
import { useContext, useEffect, useState } from "react"

import Form from "../shared/Form"
import Context from "../../Context"
import { useParams } from "react-router-dom"

interface MessageReceivedInterface {
    from: string,
    message: string
}

const Chat = () => {
    const [chats, setChats] = useState<any[]>([])
    const { session } = useContext(Context)
    const { id } = useParams()


    const messageHandler = (messageReceived: MessageReceivedInterface) => {
        setChats((prev) => [...prev, messageReceived])

    }

    useEffect(() => {
        socket.on("message", messageHandler)

        return () => {
            socket.off("message", messageHandler)
        }
    }, [])


    const sendMeessage = (values: any) => {
        const payload = {
            from: session,
            to: id,
            message: values.message
        }

        setChats((prev) => [...prev, payload])
        socket.emit("message", payload)

    }


    return (


        <div>

            <div className="h-120 overflow-auto space-y-12 pr-6 relative">

                {
                    chats.map((item, index) => (
                        <div className="space-y-12" key={index}>



                            {
                                (session._id === item.from._id) ?

                                    <div className="flex gap-4 items-start">
                                        <Avatar image={session.image || "/images/avt.jpg"} size="md" />
                                        <div className="relative bg-rose-50 text-pink-500 px-4 py-2 rounded-2xl flex-1 border border-rose-100">
                                            <h1 className="font-medium text-black capitalize">you</h1>
                                            <label>
                                                {item.message}
                                            </label>
                                            <i className=" absolute ri-arrow-left-s-fill top-0 -left-5 text-4xl text-rose-50"></i>
                                        </div>
                                    </div>

                                    :
                                    <div className="flex gap-4  items-start">
                                        <div className="relative bg-violet-50 text-blue-500 px-4 py-2 rounded-2xl flex-1 border border-violet-100">
                                            <h1 className="font-medium text-black capitalize">{item.from.fullname}</h1>
                                            <label>
                                                {item.message}
                                            </label>
                                            <i className=" absolute ri-arrow-right-s-fill top-0 -right-5 text-4xl text-violet-50 "></i>
                                        </div>
                                        <Avatar image={item.from.image} size="md" />
                                    </div>

                            }



                        </div>
                    ))
                }


            </div>

            <div className="p-3">
                <div className="flex gap-4 items-center">
                    <Form className="flex gap-4 flex-1" onValue={sendMeessage}>
                        <Input name="message" placeholder="Type your messafge here" />
                        <Button type="secondary" icon="send-ins-fill">Send</Button>

                    </Form>
                    <button className="w-12 h-12 hover:bg-rose-400 hover:text-white bg-rose-50 text-rose-500 rounded-full transition duration-150">
                        <i className="ri-attachment-2"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Chat
