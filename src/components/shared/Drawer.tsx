
import type { FC } from 'react';
import 'remixicon/fonts/remixicon.css'

interface DrawerInterface {
    children?: string;
    title?: string;
    open?: boolean;
    close?: () => void;
    key?: string | number;
}


const Drawer: FC<DrawerInterface> = ({ key = 0, children = "your content goes here", title = "Registartion", open = true, close }) => {

    return (

        <div key={key}
            style={{
                right: open === true ? '0%' : '-50%',
                transition: '0.3s'
            }}
            className="shadow-2xl fixed top-0 h-full  w-1/3 overflow-auto p-8 z-1000 space-y-4">
            <h1 className="text-lg font-semibold">{title}</h1>
            <div className="border-b border-gray-200 -mx-8"></div>
            <div className="text-gray-500">
                {children}
            </div>
            <button className="absolute top-6 right-6" onClick={close}>
                <i className="ri-close-circle-fill"></i>
            </button>
        </div>

    )
}

export default Drawer