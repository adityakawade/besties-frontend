import { Link } from "react-router-dom"
import Button from "./shared/Button"
import Card from "./shared/Card"
import Input from "./shared/Input"

const Signup = () => {
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

              <form className=" space-y-6">
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
              </form>

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
      </div>
    </div>
  )
}

export default Signup
