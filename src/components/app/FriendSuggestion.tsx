import useSWR, { mutate } from "swr"
import Card from "../shared/Card"
import Fetcher from "../../lib/fetcher"
import { Empty, Skeleton } from 'antd'
import Error from "../shared/Error"
import { useState } from "react"
import SmallButton from "../shared/SmallButton"
import HttpInterceptor from "../../lib/HttpInterceptor"
import moment from "moment"
import { catchError } from "../../lib/catchError"
import toast from "react-hot-toast"


const FriendSuggestion = () => {

    const [loading, setLoading] = useState({
        state: false,
        index: 0
    })

    const { data, error, isLoading } = useSWR("/friend/suggestion", Fetcher)






    const sendFriendRequest = async (id: string, index: number) => {
        try {
            setLoading({ state: true, index })

            await HttpInterceptor.post('/friend', { friend: id });
            toast.success("Friend request send !")
            mutate("/friend/suggestion")
            mutate('/friend')


        } catch (error) {
            catchError(error)
        }
        finally {
            setLoading({ state: false, index: 0 })
        }
    }




    return (
        <div className="h-62.5  overflow-auto">
            <Card title="Add New Friends" divider >

                {isLoading && <Skeleton active />}

                {error && <Error message={error.message} />}


                {
                    data && <div className="space-y-8">
                        {
                            data.map((item: any, index: number) => (
                                <div className="space-y-3" key={index}>
                                    <div className="flex gap-4 items-center">

                                        <img
                                            src={item.image || "/images/avt.jpg"}
                                            className="w-12 h-12 rounded object-cover" />
                                        <div>
                                            <h1 className="text-black font-medium capitalize">{item.fullname}</h1>
                                            <small className="text-gray-400">{moment(item.createdAt).format('DD MMM, YYYY')}</small>

                                        </div>

                                    </div>

                                    <SmallButton loading={loading.state && loading.index === index} onClick={() => sendFriendRequest(item._id, index)} type="secondary" icon="user-add-line" >Add Friend</SmallButton>
                                </div>
                            ))
                        }
                    </div>
                }

                {
                    data?.length === 0 &&
                    <Empty />
                }
            </Card>
        </div>
    )
}

export default FriendSuggestion
