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
import FriendSuggestion from "./friend/FriendSuggestion"
import FriendRequest from "./friend/FriendRequest"
import FriendList from "./friend/FriendList"
import { useMediaQuery } from 'react-responsive'
import Logo from "../shared/Logo"
import IconButton from "../shared/IconButton"
import FriendsOnline from "./friend/FriendsOnline"


const eightMinuteInMs = 8 * 60 * 1000;

const Layout = () => {


  const isMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const navigate = useNavigate();
  const { session, setSession } = useContext(Context);

  const { error } = useSWR('/auth/refresh-token', Fetcher, { refreshInterval: eightMinuteInMs, shouldRetryOnError: true })


  const { pathname } = useLocation();
  const [collapseSize, setCollapseSize] = useState(0)

  const [leftAsideSize, setLeftAsideSize] = useState(0);
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


  const friendUiBlackList = [
    "/app/friends",
    "/app/chat",
    "/app/video-chat",
    "/app/audio-chat"
  ]


  useEffect(() => {
    if (error) {
      logout()
    }
  }, [error])


  useEffect(() => {
    setLeftAsideSize(isMobile ? 0 : 350);
    setCollapseSize(isMobile ? 0 : 140)
  }, [isMobile])

  const isBlackListed = friendUiBlackList.some((path: string) => path === pathname)
  console.log(isBlackListed);



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
      <nav className="flex justify-between items-center  lg:hidden bg-linear-to-br from-indigo-900 via-purple-800 to-blue-900 sticky top-0 left-0 z-20000 w-full py-4 px-6">
        <Logo />
        <div className="flex gap-4">
          <IconButton onClick={logout} icon="logout-circle-line" type="success" />
          <Link to="/app/friends">
            <IconButton icon="chat-ai-line" type="danger" />
          </Link>

          <IconButton onClick={() => setLeftAsideSize(leftAsideSize === 350 ? collapseSize : 350)} icon="menu-3-line" type="warning" />
        </div>
      </nav>


      {/* left part */}
      <aside className="bg-white top-0 left-0 fixed h-full lg:p-8 overflow-y-auto overflow-x-hidden z-20000"
        style={{
          width: leftAsideSize,
          transition: '0.2s'
        }}>

        <div className="overflow-x-hidden space-y-8 bg-linear-to-br from-indigo-900 via-purple-800 to-blue-900 text-white h-full lg:rounded-2xl p-8">

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
        className="rounded-2xl lg:py-8 lg:px-1 p-6 space-y-8"
        style={
          {
            width: isMobile
              ? '100%'
              : `calc(100% - ${rightAsideSize + leftAsideSize}px)`,
            marginLeft: isMobile ? 0 : leftAsideSize,
            transition: '0.2s',

          }
        }>

        {
          (!isBlackListed) &&
          <FriendSuggestion />
        }

        <Card
          title={
            <div className="flex gap-4 items-center">
              <button className=" lg:block hidden bg-gray-100 w-10 h-10 rounded-full hover:bg-slate-200" onClick={() => setLeftAsideSize(leftAsideSize === 350 ? collapseSize : 350)}>
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

        {
          (!isBlackListed) &&
          <FriendRequest />
        }
      </section>


      {/* right part */}
      <aside className=" lg:block hidden bg-white fixed  top-0 right-0  h-full  p-8 overflow-auto space-y-8" style={{ width: rightAsideSize, transition: '0.2s' }}>

       <FriendsOnline/>

        <Card title="Recent post" />
      </aside>


    </div>
  )
}

export default Layout
