import type { FC } from "react";


interface InputInterface {
    name: string;
    placeholder?: string;
    type?: string
    key?: string | number;
    value?:string
}

const Input: FC<InputInterface> = ({ key = 0, name = "name", placeholder = "Enter text here", type = "text",value }) => {
    return (
        <input
        key={key}
        
            type={type}
            className='border border-gray-300 rounded px-3 py-2 w-full'
            placeholder={placeholder}
            name={name}
            value={value}
        />
    )
}

export default Input
