import type { FC } from 'react'
import 'remixicon/fonts/remixicon.css'


const IconButtonModel = {
  primary: "bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white w-9 h-9 rounded font-medium flex justify-center items-center transition duration-200 active:scale-95",

  secondary: "bg-indigo-50 text-indigo-500 hover:bg-indigo-500 hover:text-white w-9 h-9 rounded font-medium flex justify-center items-center transition duration-200 active:scale-95",

  danger: "bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white w-9 h-9 rounded font-medium flex justify-center items-center transition duration-200 active:scale-95",

  warning: "bg-amber-50 text-amber-500 hover:bg-amber-500 hover:text-white w-9 h-9 rounded font-medium flex justify-center items-center transition duration-200 active:scale-95",

  dark: "bg-zinc-100 text-zinc-600 hover:bg-zinc-600 hover:text-white w-9 h-9 rounded font-medium flex justify-center items-center transition duration-200 active:scale-95",

  success: "bg-green-50 text-green-500 hover:bg-green-500 hover:text-white w-9 h-9 rounded font-medium flex justify-center items-center transition duration-200 active:scale-95",

  info: "bg-cyan-50 text-cyan-500 hover:bg-cyan-500 hover:text-white w-9 h-9 rounded font-medium flex justify-center items-center transition duration-200 active:scale-95"
}



interface IconButtonInterface {
    type?: "primary" | "secondary" | "danger" | "warning" | "dark" | "success" | "info";
    onClick?: () => void;
    icon: string;
    key?: string | number;
}



const IconButton: FC<IconButtonInterface> = ({ key = 0, type = "primary", onClick, icon, }) => {

    return (
        <button key={key} className={IconButtonModel[type]} onClick={onClick}>
            <i className={`ri-${icon}  text-base`}></i>
        </button>
    )

}

export default IconButton
