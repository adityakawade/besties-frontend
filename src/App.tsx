import { BrowserRouter, Route, Routes } from "react-router-dom"
import "font-awesome/css/font-awesome.min.css";
import 'remixicon/fonts/remixicon.css'
import 'animate.css';
import Login from "./components/Login"
import Signup from "./components/Signup"
import Layout from "./components/app/Layout"
import Dashboard from "./components/app/Dashboard"
import Post from "./components/app/Post"
import Video from "./components/app/Video";
import Audio from "./components/app/Audio";
import Chat from "./components/app/Chat";
import NotFound from "./components/NotFound";
import { Toaster } from "react-hot-toast";
import Context from "./Context";
import { useState } from "react";
import AuthGuard from "./guard/AuthGuard";
import RedirectGuard from "./guard/RedirectGuard";
import FriendList from "./components/app/friend/FriendList";



const App = () => {

  const [session, setSession] = useState(null);
  return (
    <Context.Provider value={{ session, setSession }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route element={<RedirectGuard />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          <Route element={<AuthGuard />}>
            <Route path="/app" element={<Layout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="my-posts" element={<Post />} />
              <Route path="friends" element={<FriendList />} />
              <Route path="video-chat" element={<Video />} />
              <Route path="audio-chat" element={<Audio />} />
              <Route path="chat" element={<Chat />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </Context.Provider>
  )
}

export default App