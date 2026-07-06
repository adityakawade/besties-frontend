import { Link } from "react-router-dom"
import Button from "./shared/Button"
import Card from "./shared/Card"
import Input from "./shared/Input"
import Form, { type FormDataType } from "./shared/Form"
import HttpInterceptor from "../lib/HttpInterceptor"
import { toast } from 'react-toastify'
import axios from "axios"


const Signup = () => {
  const handleSignupForm = async (values: FormDataType) => {
    try {
      const { data } = await HttpInterceptor.post('/auth/signup', values);
      console.log(data);

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return toast.error(error.response?.data.message);
      }

      if (error instanceof Error) {
        return toast.error(error.message);
      }

      toast.error("Network Error");

    }

  }
  return (
    <div className="bg-gray-100 flex justify-center items-center h-screen">
      <div className="w-1/2 animate__animated animate__fadeIn">
        <Card nopadding>

          <div className="grid grid-cols-2">

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
                  type="password"
                  name="password"
                  placeholder="Password"
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
            <div className=" overflow-hidden h-125 bg-linear-to-t from-sky-500 to-indigo-500 rounded-r-xl flex justify-center items-center">
              <img src="/images/auth.svg" alt="auth" className="w-full animate__animated animate__slideInUp animate__faster" />
            </div>

          </div>
        </Card>
      </div >
    </div >
  )
}

export default Signup
