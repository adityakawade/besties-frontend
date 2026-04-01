import Button from "../shared/Button"
import Card from "../shared/Card"


const Audio = () => {
    return (
        <div className="space-y-8">

            <div className="grid grid-cols-2 gap-4">

                <Card title="Er Aditya">
                    <div className="flex flex-col items-center">
                        <img src="/images/avt.jpg" alt="avt" className="h-40 w-40 rounded-full object-cover" />
                    </div>
                </Card>

                <Card title="Er shreyash">
                    <div className="flex flex-col items-center">
                        <img src="/images/avt.jpg" alt="avt" className="h-40 w-40 rounded-full object-cover" />
                    </div>
                </Card>

            </div>

            <div className="flex justify-between items-center">

                <div className="space-x-3">

                    <button className="transition-all duration-150 bg-amber-500 text-white w-12 h-12 rounded-full hover:bg-amber-400 hover:text-white">
                        <i className="ri-mic-fill"></i>
                    </button>

                </div>

                <Button type="danger" icon="close-circle-fill">End</Button>

            </div>

        </div>
    )
}

export default Audio
