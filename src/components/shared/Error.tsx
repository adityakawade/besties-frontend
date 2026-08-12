import type { FC } from "react";

interface ErrorInterface {
    message: string;
}

const Error: FC<ErrorInterface> = ({ message }) => {
    return (
        <div className="animate__animated animate__fadeIn mx-auto flex max-w-md items-start gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 shadow-sm">
            <i className="ri-error-warning-line mt-1 text-2xl text-red-600"></i>

            <div>
                <h3 className="text-lg font-semibold text-red-600">
                    Something went wrong
                </h3>

                <p className="mt-1 text-sm leading-5 text-red-700">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default Error;