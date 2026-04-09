import Button from "../shared/Button"
import Card from "../shared/Card"
import Divider from "../shared/Divider"
import IconButton from "../shared/IconButton"

const Post = () => {
  return (
    <div className="space-y-8">
      {
        Array(20).fill(0).map((item, index) => (
          <Card key={index}>
            <div className="space-y-3">

              <p className="">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione, iure ullam debitis similique a dicta officia repellendus labore sed animi.
              </p>

              <div className="flex justify-between items-center">
                <label className="text-sm font-normal"> jan  2, 2030 07:00 pm </label>
                <div className="flex gap-3">
                  <IconButton type="info" icon="edit-fill" />
                  <IconButton type="primary" icon="delete-bin-fill" />
                </div>
              </div>

              <Divider />

              <div className="space-x-4">
                <Button type="info" icon="thumb-up-fill">20k</Button>
                <Button type="warning" icon="thumb-down-fill">20k</Button>
                <Button type="danger" icon="chat-ai-fill">20k</Button>
              </div>

            </div>
          </Card >
        ))
      }
    </div >
  )
}

export default Post
