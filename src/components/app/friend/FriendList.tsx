import { Link } from "react-router-dom"
import Card from "../../shared/Card"
import IconButton from "../../shared/IconButton"
import SmallButton from "../../shared/SmallButton"
import type { FC } from "react"

interface FriendlistInterface {
  gap?: number,
  columns?: number
}

const FriendList: FC<FriendlistInterface> = ({ gap = 6, columns = 3 }) => {
  return (
    <div className={`grid grid-cols-${columns} gap-${gap}`}>
      {
        Array(14).fill(0).map((item, index) => (
          <Card>
            <div className="flex flex-col items-center gap-3">
              <img src="/images/avt.jpg" alt="" className=" rounded-full object-cover w-20 h-20" />
              <h1 className="capitalize">Aditya kawade</h1>
              <div className="relative">
                <SmallButton icon="user-minus-fill" type="danger">Unfollow</SmallButton>
                <div className=" w-2 h-2 rounded-full bg-green-500 absolute -top-1 -right-1 animate__animated animate__pulse animate__infinite" />
              </div>
              <div className=" flex gap-3 mt-3">


                <Link to="/app/chat">
                  <IconButton icon="chat-ai-line" type="primary"></IconButton>
                </Link>


                <Link to="/app/audio-chat">
                  <IconButton icon="phone-line" type="danger"></IconButton>
                </Link>

                <Link to="/app/video-chat">
                  <IconButton icon="video-on-ai-line" type="warning"></IconButton>
                </Link>
              </div>
            </div>
          </Card>
        ))
      }
    </div>
  )
}

export default FriendList
