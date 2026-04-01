import type { FC } from 'react'
import 'remixicon/fonts/remixicon.css'

const ButtonModel = {
    primary: "bg-blue-500 hover:bg-blue-600 rounded font-medium text-white px-6 py-2 transition duration-200 active:scale-95",
    secondary: "bg-indigo-500 hover:bg-indigo-600 rounded font-medium text-white px-6 py-2 transition duration-200 active:scale-95",
    danger: "bg-rose-500 hover:bg-rose-600 rounded font-medium text-white px-6 py-2 transition duration-200 active:scale-95",
    warning: "bg-amber-500 hover:bg-amber-600 rounded font-medium text-white px-6 py-2 transition duration-200 active:scale-95",
    dark: "bg-zinc-500 hover:bg-zinc-600 rounded font-medium text-white px-6 py-2 transition duration-200 active:scale-95",
    success: "bg-green-400 hover:bg-green-500 rounded font-medium text-white px-6 py-2 transition duration-200 active:scale-95",
    info: "bg-cyan-500 hover:bg-cyan-600 rounded font-medium text-white px-6 py-2 transition duration-200 active:scale-95"
}

interface ButtonInterface {
    children?: string
    type?: "primary" | "secondary" | "danger" | "warning" | "dark" | "success" | "info"
    onClick?: () => void
    icon?: string
}

const Button: FC<ButtonInterface> = ({ children = "Submit", type = "primary", onClick, icon }) => {
    return (
        <button className={ButtonModel[type]} onClick={onClick}>
            {
                icon &&
                <i className={`ri-${icon} mr-1`}></i>
            }
            {children}
        </button>
    )
}

export default Button