import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import Avatar from "../shared/Avatar"
import Card from "../shared/Card"
import { useContext, useEffect, useState } from "react"
import Dashboard from "./Dashboard"
import Context from "../../Context"
import HttpInterceptor from "../../lib/HttpInterceptor"
import { v4 as uuid } from 'uuid'
import useSWR, { mutate } from "swr"
import Fetcher from "../../lib/fetcher"
import { catchError } from "../../lib/catchError"
import FriedsSuggestion from "./friend/FriendSuggestion"
import FriedsRequest from "./friend/FriendRequest"
import FriendsList from "./friend/FriendList"
import { useMediaQuery } from 'react-responsive'
import Logo from "../shared/Logo"
import IconButton from "../shared/IconButton"
import FriendsOnline from "./friend/FriendsOnline"

const EightMinuteInMs = 8 * 60 * 1000

const Layout = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const [leftAsideSize, setLeftAsideSize] = useState(0)
  const rightAsideSize = 450
  const [collapseSize, setCollapseSize] = useState(0)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { error } = useSWR('/auth/refresh-token', Fetcher, {
    refreshInterval: EightMinuteInMs,
    shouldRetryOnError: false
  })

  const friendsUiBlacklist = [
    "/app/friends",
    "/app/chat",
    "/app/audio-chat",
    "/app/video-chat"
  ]

  const isBlacklisted = friendsUiBlacklist.some((path) => pathname === path)

  useEffect(() => {
    if (error) {
      logout()
    }
  }, [error])

  useEffect(() => {
    setLeftAsideSize(isMobile ? 0 : 350)
    setCollapseSize(isMobile ? 0 : 140)
  }, [isMobile])

  const { session, setSession } = useContext(Context)


  const menus = [
    {
      icon: "ri-home-9-line",
      href: "/app/dashboard",
      label: "dashboard"
    },
    {
      icon: "ri-chat-smile-3-line",
      href: "/app/my-posts",
      label: "my posts"
    },
    {
      icon: "ri-group-line",
      href: "/app/friends",
      label: "friends"
    }
  ]

  const logout = async () => {
    try {
      await HttpInterceptor.post("/auth/logout")
      navigate("/login")
    }
    catch (err) {
      catchError(err)
    }
  }

  const getPathname = (path: string) => {
    const firstPath = path.split("/").pop()
    const finalPath = firstPath?.split("-").join(" ")
    return finalPath
  }

  const uploadImage = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.click()
    input.onchange = async () => {
      if (!input.files)
        return

      const file = input.files[0]
      const path = `profile-pictures/${uuid()}.png`

      const payload = {
        path,
        type: file.type,
        status: "public-read"
      }

      try {
        const options = {
          headers: {
            'Content-Type': file.type
          }
        }
        const { data } = await HttpInterceptor.post("/storage/upload", payload)
        await HttpInterceptor.put(data.url, file, options)
        const { data: user } = await HttpInterceptor.put("/auth/profile-picture", { path })
        setSession({ ...session, image: user.image })
        mutate("/auth/refresh-token")
      }
      catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <div className="min-h-screen">
      <nav className="lg:hidden flex justify-between items-center bg-linear-to-br from-indigo-900 via-purple-800 to-blue-900 sticky top-0 left-0 z-20000 w-full py-4 px-6">
        <Logo />
        <div className="flex gap-4">
          <IconButton onClick={logout} icon="logout-circle-line" type="success" />
          <Link to="/app/friends">
            <IconButton icon="chat-ai-line" type="danger" />
          </Link>
          <IconButton onClick={() => setLeftAsideSize(leftAsideSize === 250 ? collapseSize : 250)} icon="menu-3-line" type="warning" />
        </div>
      </nav>
      <aside
        className="bg-white fixed top-0 left-0 h-full lg:p-6 overflow-auto z-20000"
        style={{
          width: leftAsideSize,
          transition: '0.2s'
        }}>
        <div className="space-y-8 h-full lg:rounded-2xl p-8 bg-linear-to-br from-indigo-900 via-purple-800 to-blue-900">
          {
            leftAsideSize === collapseSize ?
              <i className="ri-user-fill text-xl text-white animate__animated animate__fadeIn"></i>
              :
              <div className="animate__animated animate__fadeIn">
                {
                  session &&
                  <Avatar
                    title={session.fullname}
                    subtitle={session.email}
                    image={session.image || "/images/avt.jpg"}
                    titleColur="white"
                    subtitleColour="#ddd"
                    onClick={uploadImage}
                  />
                }
              </div>
          }
          <div>

            {
              menus.map((item, index) => (
                <Link key={index} to={item.href} className="flex items-center gap-4 text-gray-300 py-3 hover:text-white">
                  <i className={`${item.icon} text-xl`} title={item.label}></i>
                  <label className={`capitalize ${leftAsideSize === collapseSize ? 'hidden' : ''}`}>{item.label}</label>
                </Link>
              ))
            }

            <button onClick={logout} className="flex items-center gap-2 text-gray-300 py-3 hover:text-white" title="Logout">
              <i className="ri-logout-circle-r-line text-xl"></i>
              <label className={leftAsideSize === collapseSize ? 'hidden' : ''}>Logout</label>
            </button>

          </div>
        </div>
      </aside>


      {/* Main part ----------------------------------------------------------------- */}
      <section
        className="lg:py-8 lg:px-1 flex gap-8 lg:flex-row flex-col p-6"
        style={{
          width: isMobile ? '100%' : `calc(100% - ${leftAsideSize}px)`,
          marginLeft: isMobile ? 0 : leftAsideSize,
          transition: '0.2s'
        }}
      >

        {/* {
                    !isBlacklisted &&
                    <FriedsRequest />
                } */}
        <div className=" flex-1">
          <Card
            title={
              <div className="flex gap-4 items-center">
                <button className="lg:block hidden bg-gray-100 w-10 h-10 rounded-full hover:bg-slate-200" onClick={() => setLeftAsideSize(leftAsideSize === 350 ? collapseSize : 350)}>
                  <i className="ri-arrow-left-line"></i>
                </button>
                <h1>{getPathname(pathname)}</h1>
              </div>
            }
            divider
          >
            {
              pathname === "/app" ?
                <Dashboard />
                :
                <Outlet />
            }
          </Card>
        </div>
        {/* {
                    !isBlacklisted &&
                    <FriedsSuggestion />
                } */}


        {/* right part ---------------------------------------------------- */}
        <aside className=" bg-white lg:w-100 lg:pr-6">
          <FriendsOnline />
        </aside>
      </section>

    </div>
  )
}

export default Layout