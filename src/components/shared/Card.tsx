import type { FC, ReactElement, ReactNode } from 'react';
import 'remixicon/fonts/remixicon.css'


interface CardInterface {
    children?: ReactElement;
    title?: ReactNode;
    footer?: ReactElement;
    divider?: boolean;


}


const Card: FC<CardInterface> = ({ children, title, footer, divider = false }) => {
    return (
        <div className="shadow-lg px-5 py-4 rounded border border-gray-200 space-y-2 bg-white">
            {
                title &&
                <h1 className="font-semibold text-lg capitalize ">{title}</h1>
            }

            {
                divider &&
                <div className='border-b border-b-gray-100 -mx-5 my-4'>

                </div>
            }
            {
                children &&
                <div className="text-gray-600">{children}</div>
            }

            {
                footer
                &&
                <div className="mt-5">
                    <h1>{footer}</h1>
                </div>



            }
        </div>
    )
}


export default Card