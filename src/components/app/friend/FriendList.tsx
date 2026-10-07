
import Card from "../../shared/Card"
import SmallButton from "../../shared/SmallButton"
import type { FC } from "react"
import useSWR, { mutate } from 'swr'
import Fetcher from "../../../lib/fetcher"
import { Empty, Skeleton } from "antd"
import HttpInterceptor from "../../../lib/HttpInterceptor"
import { catchError } from "../../../lib/catchError"

interface FriendlistInterface {
  gap?: number,
  columns?: number
}

const FriendList: FC<FriendlistInterface> = ({ gap = 6, columns = 3 }) => {

  const { data, error, isLoading } = useSWR('/friend', Fetcher)

  if (isLoading) {
    return <Skeleton />
  }

  if (error) {
    return <Empty />
  }

  const unfriend = async (id: string) => {
    try {
      await HttpInterceptor.delete(`/friend/${id}`)
      mutate("/friend")
      mutate("/friend/suggestion")
    } catch (error) {
      catchError(error)
    }
  }

  if (data.length === 0) {
    return <Empty />
  }
  console.log("h",data);
  




  return (
    <div className="grid"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: `${gap * 0.25}rem`
      }}>
      {
        data && data.map((item: any, index: number) => (
          <Card key={index}>
            <div className="flex flex-col items-center gap-3">
              <img src="/images/avt.jpg" alt="" className=" rounded-full object-cover w-20 h-20" />
              <h1 className=" capitalize">{item.friend.fullname}</h1>
              <div className="relative">
                {
                  item.status === "requested" ?
                    <SmallButton icon="check-double-line">Friend Request Sent</SmallButton>
                    :
                    <SmallButton onClick={() => unfriend(item._id)} icon="user-minus-fill" type="danger">Unfriend</SmallButton>

                }

              </div>

            </div>
          </Card>
        ))
      }
    </div>
  )
}

export default FriendList
