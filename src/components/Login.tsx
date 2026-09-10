import { Link, useNavigate } from "react-router-dom"
import Button from "./shared/Button"
import Card from "./shared/Card"
import Input from "./shared/Input"
import Form, { type FormDataType } from "./shared/Form"
import HttpInterceptor from "../lib/HttpInterceptor"
import { catchError } from "../lib/catchError"
import toast from "react-hot-toast"
import { useState } from "react"




const Login = () => {

  const [visible, setVisible] = useState(false)

  const navigate = useNavigate();

  const handleLoginForm = async (values: FormDataType) => {
    try {
      await HttpInterceptor.post('/auth/login', values);
      toast.success("Login success", { position: "top-right" })

      setTimeout(() => {
        navigate('/app');
      }, 3000)


    }
    catch (error: unknown) {
      catchError(error, 'top-right')
    }

  }


  return (
    <div className="bg-gray-100 w-full min-h-screen flex justify-center items-center p-4">
      <div className="lg:w-1/2 w-full max-w-md lg:max-w-none animate__animated animate__fadeIn">
        <Card nopadding>

          <div className="grid lg:grid-cols-2 grid-cols-1">

            {/* 1st div  */}
            <div className="p-8 space-y-4">

              <div className="">
                <h1 className="font-bold text-xl text-black">Sign in</h1>
                <p className="text-gray-500">Starts your first chat now !</p>
              </div>

              <Form className=" space-y-6" onValue={handleLoginForm}>

                <Input
                  name="email"
                  placeholder="Email Id"

                />

                <Input
                  icon={<i className={` text-[17px] ${visible ? 'ri-eye-off-fill' : 'ri-eye-fill'}`}></i>}
                  type={visible ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  onclick={() => setVisible((prev) => !prev)}

                />





                <Button type="danger" icon="arrow-right-up-fill">Login</Button>
              </Form>

              <div className="flex gap-2">
                <p>Don't have an account ?</p>
                <Link className="font-medium text-green-400 hover:underline" to="/signup">Sign up</Link>
              </div>

            </div>


            {/* 2nd div */}
            <div className="hidden overflow-hidden h-125 bg-linear-to-t from-sky-500 to-indigo-500 rounded-r-xl lg:flex justify-center items-center">
              <img src="/images/authlogin.svg" alt="auth" className="w-[90%] animate__animated animate__slideInUp animate__faster" />
            </div>

          </div>
        </Card>
      </div>
    </div>
  )
}

export default Login
