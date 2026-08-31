import Fetcher from "../../lib/fetcher"
import Card from "../shared/Card"
import useSWR, { mutate } from 'swr'
import Error from "../shared/Error"
import { Skeleton } from "antd"
import HttpInterceptor from "../../lib/HttpInterceptor"
import { catchError } from "../../lib/catchError"



const Friend = () => {
  const { data, error, isLoading } = useSWR('/friend', Fetcher)

  console.log(data);

  if (isLoading) {
    return <Skeleton active />
  }

  if (error) {
    return <Error message={error?.message} />
  }


  const unfriend = async (id: string) => {
    try {
      await HttpInterceptor.delete(`friend/${id}`)
      mutate('/friend')
      mutate("/friend/suggestion")
    } catch (error) {
      catchError(error)
    }
  }

  return (
    <div className="grid grid-cols-3 gap-8">
      {
        data.map((item: any, index: number) => (
          <Card key={index}>
            <div className="flex flex-col items-center gap-3">

              <img src={item.friend.image || "/images/avt.jpg"} alt={item.friend.fullname} className="w-16 h-16 rounded-full object-cover" />
              <h1 className="text-base text-black font-medium capitalize">{item.friend.fullname}</h1>
              {
                item.status === 'accepted' ?
                  <button onClick={() => unfriend(item?._id)} className="bg-rose-400 text-xs px-2 py-1 rounded text-white hover:bg-rose-500 transition duration-150 mt-1 font-medium">
                    <i className="ri-user-minus-line mr-1"></i>
                    Unfriend</button>
                  :
                  <button className="bg-green-400 text-xs px-2 py-1 rounded text-white hover:bg-gray-400 transition duration-150 mt-1 font-medium">
                    <i className="ri-check-double-line mr-1"></i>
                    Request Sent</button>
              }

            </div>
          </Card>
        ))
      }
    </div>
  )
}

export default Friend
