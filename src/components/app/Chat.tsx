import Avatar from "../shared/Avatar"
import Button from "../shared/Button"
import Input from "../shared/Input"
import socket from "../../lib/socket"
import { useContext, useEffect, useRef, useState, type ChangeEvent, type FC } from "react"
import useSWR from "swr"
import Form from "../shared/Form"
import Context from "../../Context"
import { useParams } from "react-router-dom"
import Fetcher from "../../lib/fetcher"
import { v4 as uuid } from "uuid"
import HttpInterceptor from "../../lib/HttpInterceptor"
import { catchError } from "../../lib/catchError"
import Card from "../shared/Card"
import SmallButton from "../shared/SmallButton"
import moment from "moment"


interface MessageReceivedInterface extends AttachmentUiInterface {
    from: string,
    message: string,
}
interface AttachmentUiInterface {
    file: {
        path: string,
        type: string
    }
}

const AttachmentUi: FC<AttachmentUiInterface> = ({ file }) => {
    if (file.type.startsWith("video/")) {
        return (
            <video src={file.path} className="w-full " controls></video>
        )
    }

    if (file.type.startsWith("image/")) {
        return (
            <img src={file.path} className="w-full" />
        )
    }

    return (
        <Card>
            <i className="ri-file-line text-5xl"></i>
        </Card>
    )
}

const Chat = () => {
    const chatContainer = useRef<HTMLDivElement | null>(null)
    const [chats, setChats] = useState<any[]>([])
    const { session } = useContext(Context)
    const { id } = useParams()

    const { data } = useSWR(id ? `/chat/${id}` : null, id ? Fetcher : null)




    const messageHandler = (messageReceived: MessageReceivedInterface) => {
        setChats((prev) => [...prev, messageReceived])

    }

    const attachmentHandler = (messageReceived: any) => {
        setChats((prev) => [...prev, messageReceived])

    }

    // linstning all socket event recieved message
    useEffect(() => {
        socket.on("message", messageHandler)
        socket.on("attachment", attachmentHandler)

        return () => {
            socket.off("message", messageHandler)
            socket.off("attachment", attachmentHandler)
        }
    }, [])

    // setting old chat
    useEffect(() => {
        if (data) {
            setChats(data)
        }
    }, [data])

    // setup scrollbar position
    useEffect(() => {
        const chatdiv = chatContainer.current
        if (chatdiv) {
            chatdiv.scrollTop = chatdiv.scrollHeight
        }
    }, [chats])


    const sendMeessage = (values: any) => {
        const payload = {
            from: session,
            to: id,
            message: values.message
        }

        setChats((prev) => [...prev, payload])
        socket.emit("message", payload)


    }



    const fileSharing = async (e: ChangeEvent<HTMLInputElement>) => {
        try {


            const input = e.target
            if (!input.files) {
                return
            }
            const file = input.files[0]
            const ext = file.name.split('.').pop()
            const fileName = `${uuid()}.${ext}`
            const path = `chats/${fileName}`

            const payload = {
                path,
                type: file.type,
                status: 'private'
            }

            const options = {
                headers: {
                    'Content-type': file.type
                }
            }


            const { data } = await HttpInterceptor.post('/storage/upload', payload)
            await HttpInterceptor.put(data.url, file, options)


            socket.emit("attachment", {
                from: session,
                to: id,
                message: fileName,
                file: {
                    path,
                    type: file.type
                }
            })


        } catch (error) {
            catchError(error)
        }

    }

    const download = async (path: string) => {
        try {
            console.log(path);

            const filename: any = path.split("/").pop()
            const { data } = await HttpInterceptor.post('/storage/download', { path })
            const a = document.createElement("a");
            a.href = data.url
            a.download = filename
            a.click()
            a.remove()

        } catch (error) {
            console.log(error);

            catchError(error)
        }
    }

    return (


        <div>

            <div className="h-120 overflow-auto space-y-12 pr-6 relative" ref={chatContainer}>

                {
                    chats.map((item, index) => (
                        <div className="space-y-12" key={index}>



                            {
                                (session._id === item.from._id) ?

                                    <div className="flex gap-4 items-start">
                                        <Avatar image={session.image || "/images/avt.jpg"} size="md" />
                                        <div className="flex flex-col gap-3 relative bg-rose-50 text-pink-500 px-4 py-2 rounded-2xl flex-1 border border-rose-100">
                                            <h1 className="font-medium text-black capitalize">you</h1>
                                            {item.file && <AttachmentUi file={item.file} />}
                                            <label>
                                                {item.message}
                                            </label>
                                            {
                                                item.file &&
                                                <div>
                                                    <SmallButton onClick={() => download(item.file.path)} type="success" icon="download-line">Download</SmallButton>
                                                </div>
                                            }
                                            <div className="text-gray-500 text-right">
                                                {moment().format('MMM DD, YYYY hh:mm:ss A')}
                                            </div>
                                            <i className=" absolute ri-arrow-left-s-fill top-0 -left-5 text-4xl text-rose-50"></i>
                                        </div>
                                    </div>

                                    :
                                    <div className="flex gap-4  items-start">
                                        <div className="relative bg-violet-50 text-blue-500 px-4 py-2 rounded-2xl flex-1 border border-violet-100">
                                            <h1 className="font-medium text-black capitalize">{item.from.fullname}</h1>
                                            {item.file && <AttachmentUi file={item.file} />}
                                            <label>
                                                {item.message}
                                            </label>
                                            {
                                                item.file &&
                                                <div>
                                                    <SmallButton onClick={() => download(item.file.path)} type="warning" icon="download-line">Download</SmallButton>
                                                </div>
                                            }
                                            <div className="text-gray-500 text-right">
                                                {moment().format('MMM DD, YYYY hh:mm:ss A')}
                                            </div>
                                            <i className=" absolute ri-arrow-right-s-fill top-0 -right-5 text-4xl text-violet-50 "></i>
                                        </div>
                                        <Avatar image={item.from.image || "/images/avt.jpg"} size="md" />
                                    </div>

                            }



                        </div>
                    ))
                }


            </div>

            <div className="p-3">
                <div className="flex gap-4 items-center">
                    <Form className="flex gap-4 flex-1" onValue={sendMeessage} reset>
                        <Input name="message" placeholder="Type your messafge here" />
                        <Button type="secondary" icon="send-ins-fill">Send</Button>

                    </Form>
                    <button className=" relative w-12 h-12 hover:bg-rose-400 hover:text-white bg-rose-50 text-rose-500 rounded-full transition duration-150">
                        <i className="ri-attachment-2"></i>
                        <input onChange={fileSharing} type="file" className=" opacity-0  rounded-full absolute w-full h-full top-0 left-0 " />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Chat
