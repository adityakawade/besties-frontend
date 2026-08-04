import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./components/Home"
import 'remixicon/fonts/remixicon.css'
import 'animate.css';
import Login from "./components/Login"
import Signup from "./components/Signup"
import Layout from "./components/app/Layout"
import Dashboard from "./components/app/Dashboard"
import Post from "./components/app/Post"
import Friend from "./components/app/Friend"
import Video from "./components/app/Video";
import Audio from "./components/app/Audio";
import Chat from "./components/app/Chat";
import NotFound from "./components/NotFound";
import { ToastContainer } from "react-toastify";
import Guard from "./Guard";
import Context from "./Context";
import { useState } from "react";



const App = () => {

  const [session, setSession] = useState();
  return (
    <Context.Provider value={{ session, setSession }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<Guard />}>
            <Route path="/app" element={<Layout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="my-posts" element={<Post />} />
              <Route path="friends" element={<Friend />} />
              <Route path="video-chat" element={<Video />} />
              <Route path="audio-chat" element={<Audio />} />
              <Route path="chat" element={<Chat />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </Context.Provider>
  )
}

export default App