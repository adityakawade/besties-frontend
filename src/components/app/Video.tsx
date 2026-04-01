import Button from "../shared/Button"


const Video = () => {
    return (
        <div className="space-y-8">

            <div className="bg-black w-full h-0 relative pb-[56.25%] rounded-xl">
                <video className=" absolute top-0 left-0 w-full h-full"></video>
                <button className="absolute bottom-5 left-5 text-xs text-white  bg-white/10 py-1 px-2.5 rounded-lg">Aditya kawade</button>
                <button className="absolute bottom-5 right-5 text-xs text-white bg-white/10 py-1 px-2.5 rounded-lg hover:scale-125 transition duration-200">
                <i className="ri-fullscreen-line"></i>
                </button>
            </div>


            <div className="grid grid-cols-3 gap-4">


                <div className="bg-black w-full h-0 relative pb-[56.25%] rounded-xl">
                    <video className=" absolute top-0 left-0 w-full h-full"></video>
                    <button className="absolute bottom-2 left-2 text-xs text-white  bg-white/10 py-1 px-2.5 rounded-lg">Aditya kawade</button>
                </div>


                <Button type="primary" icon="user-add-fill">Add</Button>


            </div>


            <div className="flex justify-between items-center">
                <div className="space-x-3">
                    <button className="transition-all duration-150 bg-green-500 text-white  w-12 h-12 rounded-full hover:bg-green-400 hover:text-white">
                        <i className="ri-video-on-ai-fill"></i>
                    </button>


                    <button className="transition-all duration-150 bg-amber-500 text-white w-12 h-12 rounded-full hover:bg-amber-400 hover:text-white">
                        <i className="ri-mic-fill"></i>
                    </button>

                    <button className="transition-all duration-150 bg-indigo-500 text-white w-12 h-12 rounded-full hover:bg-indigo-400 hover:text-white">
                        <i className="ri-tv-2-fill"></i>
                    </button>


                </div>

                <Button type="danger" icon="close-circle-fill">End</Button>
            </div>
        </div>
    )
}

export default Video
