import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import {Routes,Route, Navigate} from "react-router-dom"
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from "./pages/ProfilePage"
import SettingsPage from  "./pages/SettingPage"
import SignUpPage from "./pages/SignUpPage"
import { useAuthStore } from './store/useAuthStore'
import {Loader} from "lucide-react"
import {toast, Toaster} from "react-hot-toast"
import { THEMES } from './constants'
import { useThemeStore } from './store/useTheme.js'
function App() {

  //auth check ke liye ki user h ki nhi 
  const {authUser,checkAuth,isCheckingAuth,onlineUsers}= useAuthStore()
  console.log("The online users are "+onlineUsers)
  useEffect(()=>{
    checkAuth()
  },[checkAuth])
  console.log({authUser})
  const {theme} = useThemeStore()
  if(isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin"></Loader>
    </div>
  )
  return (
    <div data-theme={theme}>
    <Navbar></Navbar>
    <Routes>
     <Route path='/'element={authUser?<HomePage />: <Navigate to={"/login"}/>} />
     <Route path='/signup'element={!authUser?<SignUpPage />:<Navigate to={"/"}/>} />
     <Route path='/login'element={!authUser?<LoginPage />:<Navigate to={"/"}/>} />
     <Route path='/settings'element={<SettingsPage />} />
     <Route path='/profile'element={authUser?<ProfilePage />:<Navigate to={"/login"}/> } />




    </Routes>
    <Toaster/>
    </div>
  )
}

export default App