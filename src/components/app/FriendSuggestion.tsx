import useSWR from "swr"
import Card from "../shared/Card"
import Fetcher from "../../lib/fetcher"
import { Skeleton } from 'antd'
import Error from "../shared/Error"
import Button from "../shared/Button"
import { useState } from "react"
import SmallButton from "../shared/SmallButton"
import HttpInterceptor from "../../lib/HttpInterceptor"


const FriendSuggestion = () => {

    const [loading, setLoading] = useState({
        state: false,
        index: 0
    })

    const { data, error, isLoading } = useSWR("/friend/suggestion", Fetcher)
    



    const sendFriendRequest = async (id: string, index: number) => {
        try {
            setLoading({ state: true, index })

            const { data } = await HttpInterceptor.post('/friend', { friend: id });
            console.log(data);

        } catch (error) {

        }
        finally {
            setLoading({ state: false, index:0 })
        }
    }




    return (
        <div className="h-62.5  overflow-auto">
            <Card title="Suggested" divider >

                {isLoading && <Skeleton active />}

                {error && <Error message={error.message} />}


                {
                    data && <div className="space-y-8">
                        {
                            data && data.map((item: any, index: number) => (
                                <div key={index} className="flex gap-4 items-center">

                                    <img
                                        src={item.image || "/images/avt.jpg"}
                                        className="w-16 h-16 rounded object-cover" />
                                    <div className="space-y-2">
                                        <h1 className="text-black font-medium capitalize`">{item.fullname}</h1>
                                        <SmallButton loading={loading.state && loading.index === index} onClick={() => sendFriendRequest(item._id, index)} type="success" icon="user-add-line" >Add Friend</SmallButton>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                }
            </Card>
        </div>
    )
}

export default FriendSuggestion
