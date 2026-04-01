import Avatar from "../shared/Avatar"
import Button from "../shared/Button"
import Input from "../shared/Input"

const Chat = () => {
    return (
        <div className="space-y-12">

            <div className="h-120 overflow-auto space-y-12">

                {
                    Array(20).fill(0).map((item, index) => (
                        <div className="space-y-12" key={index}>

                            <div className="flex gap-4 items-start">
                                <Avatar image="/images/avt.jpg" size="md" />
                                <div className="relative bg-rose-50 text-pink-500 px-4 py-2 rounded-2xl flex-1 border border-rose-100">
                                    <h1 className="font-medium text-black">Er Aditya</h1>
                                    <label>
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit..
                                    </label>
                                    <i className=" absolute ri-arrow-left-s-fill top-0 -left-5 text-4xl text-rose-50"></i>
                                </div>
                            </div>


                            <div className="flex gap-4  items-start">
                                <div className="relative bg-violet-50 text-blue-500 px-4 py-2 rounded-2xl flex-1 border border-violet-100">
                                    <h1 className="font-medium text-black">Er Aditya</h1>
                                    <label>
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit..
                                    </label>
                                    <i className=" absolute ri-arrow-right-s-fill top-0 -right-5 text-4xl text-violet-50 "></i>
                                </div>
                                <Avatar image="/images/avt.jpg" size="md" />
                            </div>

                        </div>
                    ))
                }


            </div>

            <div className="p-3">
                <div className="flex gap-4 items-center">
                    <form className="flex gap-4 flex-1">
                        <Input name="message" placeholder="Type your messafge here" />
                        <Button type="secondary" icon="send-ins-fill">Send</Button>

                    </form>
                    <button className="w-12 h-12 hover:bg-rose-400 hover:text-white bg-rose-50 text-rose-500 rounded-full transition duration-150">
                        <i className="ri-attachment-2"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Chat
