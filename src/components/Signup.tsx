import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import Button from "./shared/Button"
import Card from "./shared/Card"
import Input from "./shared/Input"
import Form, { type FormDataType } from "./shared/Form"
import HttpInterceptor from "../lib/HttpInterceptor"
import { catchError } from "../lib/catchError"
import { useState } from "react"
import toast from "react-hot-toast"


const Signup = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false)


  const handleSignupForm = async (values: FormDataType) => {
    try {
      await HttpInterceptor.post('/auth/signup', values);
      toast.success("Account Created Successsfully Please login")
      setTimeout(() => {
        navigate('/login')
      }, 2000);

    } catch (error) {
      catchError(error)

    }

  }


  return (
    <div className="bg-gray-100 flex justify-center items-center min-h-screen p-4">
      <div className="lg:w-1/2 w-full animate__animated animate__fadeIn">
        <Card nopadding>

          <div className="grid lg:grid-cols-2 grid-cols-1">

            {/* 1st div  */}
            <div className="p-8 space-y-4">

              <div className="">
                <h1 className="font-bold text-xl text-black">Sign Up</h1>
                <p className="text-gray-500">Starts your first chat now !</p>
              </div>

              <Form className=" space-y-6" onValue={handleSignupForm}>
                <Input
                  name="fullname"
                  placeholder="Fullname"
                />
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
                <Input
                  name="mobile"
                  placeholder="Mobile"
                />
                <Button type="danger" icon="arrow-right-up-fill">Sign up</Button>
              </Form>

              <div className="flex gap-2">
                <p>Already have an account ?</p>
                <Link className="font-medium text-green-400 hover:underline" to="/login">Sign in</Link>
              </div>

            </div>


            {/* 2nd div */}
            <div className="hidden overflow-hidden h-125 bg-linear-to-t from-sky-500 to-indigo-500 rounded-r-xl lg:flex justify-center items-center">
              <img src="/images/auth.svg" alt="auth" className="w-full animate__animated animate__slideInUp animate__faster" />
            </div>

          </div>
        </Card>
      </div >
    </div >
  )
}

export default Signup
