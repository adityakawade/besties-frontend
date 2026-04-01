import type { FC } from "react";


interface InputInterface {
    name: string;
    placeholder?: string;
    type?: string
}

const Input: FC<InputInterface> = ({ name = "name", placeholder = "Enter text here", type = "text" }) => {
    return (
        <input
            type={type}
            className='border border-gray-300 rounded px-3 py-2 w-full'
            placeholder={placeholder}
            name={name}
        />
    )
}

export default Input
