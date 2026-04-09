import type { FC } from "react";


interface InputInterface {
    name: string;
    placeholder?: string;
    type?: string
    key?: string | number;
}

const Input: FC<InputInterface> = ({ key = 0, name = "name", placeholder = "Enter text here", type = "text" }) => {
    return (
        <input
        key={key}
            type={type}
            className='border border-gray-300 rounded px-3 py-2 w-full'
            placeholder={placeholder}
            name={name}
        />
    )
}

export default Input
