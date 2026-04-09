import { Link, Outlet, useLocation } from "react-router-dom"
import Avatar from "../shared/Avatar"
import Card from "../shared/Card"
import { useState } from "react"
import Dashboard from "./Dashboard"

const Layout = () => {


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



  // 
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
                <Avatar
                  size={leftAsideSize === 350 ? "lg" : "md"}
                  title="aditya kawade"
                  subtitle="Developer"
                  image="/images/avt.jpg"
                  titleColur="white"
                  subtitleColour="#ddd"
                />
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

            <button title="Logout" className="flex gap-2 items-center text-gray-300  py-3 rounded hover:text-white transition-all cursor-pointer">
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

        <div className="h-62.5  overflow-auto">
          <Card title="Suggested" divider >
            <div className="space-y-8">
              {
                Array(20).fill(0).map((item, index) => (
                  <div key={index} className="flex gap-4 items-center">

                    <img src="/images/avt.jpg" alt="avt" className="w-16 h-16 rounded object-cover" />
                    <div className="">
                      <h1 className="text-black font-medium">Ravi Ranjan Kumar</h1>
                      <button className="bg-green-400 font-medium text-xs px-2 py-1 rounded text-white hover:bg-green-500 transition duration-150 mt-1">
                        <i className="ri-user-add-line mr-1"></i>
                        Add Friend</button>
                    </div>
                  </div>
                ))
              }
            </div>
          </Card>
        </div>

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
