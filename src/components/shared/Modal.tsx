import 'remixicon/fonts/remixicon.css'
import 'animate.css';
import type { FC } from 'react';


interface ModalInterface {
    open?: boolean;
    onClose?: () => void;
    title?: string;
    children?: string
    key?: string | number;
}

const Modal: FC<ModalInterface> = ({ key = 0, open = true, onClose, title = "Modal Title", children = "Modal Description goes here" }) => {
    return (
        <>
            {
                open &&


                <div key={key} className='h-screen flex  justify-center  items-center bg-black/90  fixed top-0 left-0 w-full animate__animated animate__fadeIn '>
                    <div className='w-120 relative shadow-xl rounded-lg animate__animated animate__bounceIn px-5 py-4 bg-white border border-gray-200 space-y-2'>
                        <h1 className='text-lg font-semibold '>{title}</h1>
                        <div className='text-gray-500'>
                            {children}
                        </div>
                        <button className='absolute top-3 right-3 text-zinc-500  transition-all hover:text-zinc-600' onClick={onClose}>
                            <i className='ri-close-circle-fill '></i>
                        </button>
                    </div>
                </div>
            }
        </>
    )
}

export default Modal
