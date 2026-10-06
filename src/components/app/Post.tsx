const env = import.meta.env
import { useState } from "react"
import Button from "../shared/Button"
import Card from "../shared/Card"
import { Card as AntCard, message, Skeleton } from "antd"
import Divider from "../shared/Divider"
import Editor from "../shared/Editor"
import IconButton from "../shared/IconButton"
import HttpInterceptor from "../../lib/HttpInterceptor"
import { v4 as uuid } from 'uuid'
import { catchError } from "../../lib/catchError"
import moment from "moment"
import useSWR, { mutate } from 'swr'
import Fetcher from "../../lib/fetcher"


interface fileDataInterface {
  url: string,
  file: File
}

const Post = () => {


  const { data, error, isLoading } = useSWR("/post", Fetcher)

  const [value, setValue] = useState("")
  const [fileData, setFileData] = useState<fileDataInterface | null>(null)

  const attachFile = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*,video/*"
    input.click()

    input.onchange = () => {

      if (!input.files) {
        return
      }
      const file = input.files[0]
      input.remove()
      const url = URL.createObjectURL(file)

      setFileData({ url, file })
      console.log(file);


    }
  }


  const createPost = async () => {
    try {
      let path = null;
      if (fileData) {
        const ext = fileData.file.name.split(".").pop();
        const filename = `${uuid()}.${ext}`
        path = `posts/${filename}`
        const payload = {
          path: path,
          status: 'public-read',
          type: fileData.file.type
        }


        const options = {
          headers: {
            'Content-type': fileData.file.type
          }
        }

        const { data } = await HttpInterceptor.post("/storage/upload", payload)
        await HttpInterceptor.put(data.url, fileData.file, options)

      }

      const formData = {
        attachment: path,
        type: path ? fileData?.file.type : null,
        content: value
      }

      await HttpInterceptor.post("/post/", formData)
      mutate("/post")
      message.success("post created successfully")
      setFileData(null)

    } catch (error) {
      catchError(error)
    }
  }


  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-8">
        {
          value.length === 0 &&
          <h1 className="text-lg text-black font-medium">Write your post Here</h1>
        }
        {
          value.length > 0 &&
          <AntCard>
            <div className="space-y-6 ">
              {
                fileData && fileData.file.type.startsWith("image/") &&
                <img src={fileData.url} className="rounded-lg object-cover w-full " />
              }

              {
                fileData && fileData.file.type.startsWith("video/") &&
                <video src={fileData.url} className="rounded-lg object-cover w-full " controls />
              }
              <div dangerouslySetInnerHTML={{ __html: value }} className="hard-reset" />
              <label className="text-gray-500">{moment().format("MMM DD, hh:mm A")}</label>
            </div>
          </AntCard>
        }

        <Editor
          value={value}
          setValue={setValue}
        />

        <div className="space-x-4">
          <Button onClick={attachFile} icon="attachment-line" type="danger">Attach</Button>
          {
            fileData &&
            <Button onClick={() => setFileData(null)} icon="loop-left-line" type="warning">Reset</Button>
          }
          <Button onClick={createPost} icon="send-plane-fill" type="secondary">Post</Button>
        </div>

      </div>

      {
        isLoading &&
        <Skeleton active />
      }

      {
        data && data.map((item: any, index: number) => (
          <Card key={index}>
            <div className="space-y-3">

              {
                item.attachment && item.type.startsWith("image/") &&
                <img src={`${env.VITE_S3_URL}/${item.attachment}`} className="rounded-lg object-cover w-full " />
              }

              {
                item.attachment && item.type.startsWith("video/") &&
                <video src={`${env.VITE_S3_URL}/${item.attachment}`} className="rounded-lg object-cover w-full " controls />
              }

              <div dangerouslySetInnerHTML={{ __html: item.content }} className="hard-reset" />


              <div className="flex justify-between items-center">
                <label className="text-sm font-normal"> {moment(item.createdAt).format("MMM DD YYYY, hh:mm A")}</label>

              </div>

              <Divider />

              <div className="space-x-4">
                <Button type="info" icon="thumb-up-fill">{item.like || 0}</Button>
                <Button type="warning" icon="thumb-down-fill">{item.dislike || 0}</Button>
                <Button type="danger" icon="chat-ai-fill">{item.comment || 0}</Button>
              </div>

            </div>
          </Card >
        ))
      }
    </div >
  )
}

export default Post
