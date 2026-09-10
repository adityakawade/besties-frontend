import type { FC, ReactNode } from "react";


interface InputInterface {
    name: string;
    placeholder?: string;
    type?: string
    key?: string | number;
    value?: string;
    icon?: ReactNode
    onclick?: () => void
}

const Input: FC<InputInterface> = ({ key = 0, name = "name", placeholder = "Enter text here", type = "text", value, icon, onclick }) => {
    return (
        <div className="flex border border-gray-300 rounded px-3 py-2 w-full justify-between">
            <input
                key={key}

                type={type}
                className="w-full flex-1 border-none outline-none focus:outline-none focus:ring-0 focus:border-none"
                placeholder={placeholder}
                name={name}
                value={value}
                autoComplete={name === "password" ? "current-password" : "email"}
            />
            {icon && (
                <button
                    type="button"
                    className="cursor-pointer text-gray-500"
                    onClick={onclick}
                >
                    {icon}
                </button>
            )}
        </div>
    )
}

export default Input
