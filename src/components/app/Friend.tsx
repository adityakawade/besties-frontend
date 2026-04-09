import Card from "../shared/Card"


const Friend = () => {
  return (
    <div className="grid grid-cols-3 gap-8">
      {
        Array(20).fill(0).map((item, index) => (
          <Card key={index}>
            <div className="flex flex-col items-center gap-3">

              <img src="/images/avt.jpg" alt="" className="w-16 h-16 rounded-full object-cover" />
              <h1 className="text-base text-black font-medium">aditya</h1>
              <button className="bg-rose-400 text-xs px-2 py-1 rounded text-white hover:bg-rose-500 transition duration-150 mt-1 font-medium">
                <i className="ri-user-minus-line mr-1"></i>
                Unfriend</button>

            </div>
          </Card>
        ))
      }
    </div>
  )
}

export default Friend
