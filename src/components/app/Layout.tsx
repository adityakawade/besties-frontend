import { Link, Outlet, useLocation } from "react-router-dom"
import Avatar from "../shared/Avatar"
import { useNavigate } from "react-router-dom"
import Card from "../shared/Card"
import { useContext, useEffect, useState } from "react"
import Dashboard from "./Dashboard"
import Context from "../../Context"
import HttpInterceptor from "../../lib/HttpInterceptor"
import { v4 as uuid } from 'uuid'
import useSWR, { mutate } from 'swr'
import Fetcher from "../../lib/fetcher"
import { catchError } from "../../lib/catchError"
import FriendSuggestion from "./FriendSuggestion"
import FriendRequest from "./FriendRequest"
const eightMinuteInMs = 8 * 60 * 1000;

const Layout = () => {



  const navigate = useNavigate();
  const { session, setSession } = useContext(Context);

  const { error } = useSWR('/auth/refresh-token', Fetcher, { refreshInterval: eightMinuteInMs, shouldRetryOnError: true })

  useEffect(() => {
    if (error) {
      logout()
    }
  }, [error])

  const { pathname } = useLocation();
  const collapseSize = 140

  const [leftAsideSize, setLeftAsideSize] = useState(350);
  const rightAsideSize = 450;





  const menues = [
    {
      href: "/app/dashboard",
      icon: "ri-home-9-fill ",
      label: "Dashboard"
    },
    {
      href: "/app/my-posts",
      icon: "ri-chat-smile-3-fill ",
      label: "My Post"
    },
    {
      href: "/app/friends",
      icon: "ri-group-fill ",
      label: "Friends"
    },

  ]

  const getPathname = (pathname: string) => {
    const firstpath = pathname.split("/").pop();
    const finalpath = firstpath?.split("-").join(" ");
    return finalpath
  }


  const uploadImage = () => {
    const input = document.createElement('input');
    input.type = "file"
    input.accept = "image/*"
    input.click();
    input.onchange = async () => {
      if (!input.files) {
        return
      }
      const file = input.files[0];
      const path = `profile-picture/${uuid()}.png`
      const payload = {
        path,
        type: file.type,
        status: "public-read"
      }
      try {

        const options = {
          headers: {
            'Content-type': file.type
          }
        }
        const { data } = await HttpInterceptor.post('/storage/upload', payload)  // backend api that return url

        await HttpInterceptor.put(data.url, file, options) // react will direct upload photo to s3

        const { data: user } = await HttpInterceptor.put('/auth/profile-picture', { path })

        setSession({ ...session, image: user.image })

        mutate('/auth/refreh-token')

      } catch (error) {
        console.log(error);

      }
    }

  }


  const logout = async () => {
    try {
      await HttpInterceptor.post('/auth/logout');
      navigate('/login');
    } catch (error) {
      catchError(error)
    }
  }

  return (
    <div className="min-h-screen">


      {/* left part */}
      <aside className="bg-white top-0 left-0 fixed h-full p-8 overflow-y-auto overflow-x-hidden"
        style={{
          width: leftAsideSize,
          transition: '0.2s'
        }}>

        <div className="overflow-x-hidden space-y-8 bg-linear-to-br from-indigo-900 via-purple-800 to-blue-900 text-white h-full rounded-2xl p-8">

          {
            leftAsideSize === 350 ?
              <div className="animate__animated animate__fadeIn">
                {
                  session &&
                  <Avatar
                    size={leftAsideSize === 350 ? "lg" : "md"}
                    title={session.fullname}
                    subtitle={session.email}
                    image={session.image || "/images/avt.jpg"}
                    titleColur="white"
                    subtitleColour="#ddd"
                    onClick={uploadImage}
                  />
                }
              </div>
              :
              <i title="user profile" className="ri-user-fill text-xl animate__animated animate__fadeIn"></i>
          }

          <div>

            {menues.map((item, index) => (
              <Link key={index} to={item.href} className="flex gap-5 items-center text-gray-300  py-3 rounded hover:text-white transition-all">
                <i title={item.label} className={`${item.icon} text-xl cursor-pointer`}></i>
                <label className={` ${leftAsideSize === 350 ? '' : 'hidden'} cursor-pointer capitalize`}>{item.label}</label>
              </Link>
            ))}

            <button onClick={logout} title="Logout" className="flex gap-2 items-center text-gray-300  py-3 rounded hover:text-white transition-all cursor-pointer">
              <i className="ri-logout-circle-r-fill text-xl"></i>
              <label className={` ${leftAsideSize === 350 ? '' : 'hidden'} cursor-pointer capitalize`}>Logout</label>
            </button>
          </div>

        </div>

      </aside>


      {/* main part */}
      <section
        className="rounded-2xl py-8 px-1"
        style={
          {
            width: `calc(100% - ${rightAsideSize + leftAsideSize}px)`,
            marginLeft: leftAsideSize,
            transition: '0.2s'
          }
        }>
        <Card

          title={
            <div className="flex gap-4 items-center">
              <button className="bg-gray-100 w-10 h-10 rounded-full hover:bg-slate-200" onClick={() => setLeftAsideSize(leftAsideSize === 350 ? collapseSize : 350)}>
                <i className="ri-arrow-left-line"></i>
              </button>
              <h1>{getPathname(pathname)}</h1>
            </div>
          }
          divider
        >
          {
            pathname === '/app' ? <Dashboard /> : <Outlet />
          }
        </Card>
      </section>


      {/* right part */}
      <aside className="top-0 bg-white right-0 fixed h-full w-70 p-8 overflow-auto space-y-8" style={{ width: rightAsideSize, transition: '0.2s' }}>

        <FriendSuggestion />
        <FriendRequest />

        <Card title="Friends" divider>

          <div className="space-y-5">
            {Array(20).fill(0).map((item, index) => (

              <div key={index} className="hover:bg-gray-100 bg-gray-50 rounded-2xl p-3 transition-all duration-300  flex justify-between ">
                <Avatar

                  size="md"
                  image="/images/avt.jpg"
                  title="shree kawade"
                  subtitle={
                    <small className={`${index % 2 === 0 ? "text-green-400" : "text-zinc-400"} capitalize font-bold`}>{index % 2 === 0 ? "Online" : "Ofline"}</small>
                  }
                />

                <div className="space-x-3">

                  <Link to="/app/chat">
                    <button className="hover:text-blue-600 text-blue-500 transition-all" title="chat">
                      <i className="ri-chat-ai-fill"></i>
                    </button>
                  </Link>

                  <Link to="/app/audio-chat">
                    <button className="hover:text-rose-600 text-rose-500 transition-all" title="call">
                      <i className="ri-phone-fill"></i>
                    </button>
                  </Link>

                  <Link to="/app/video-chat">
                    <button className="hover:text-amber-600 text-amber-500 transition-all" title="video call">
                      <i className="ri-video-on-ai-fill"></i>
                    </button>
                  </Link>
                </div>

              </div>


            ))}
          </div>
        </Card>
      </aside>
    </div>
  )
}

export default Layout
