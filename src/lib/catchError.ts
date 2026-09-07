import axios from "axios";
import { toast, type ToastPosition } from "react-hot-toast"



export const catchError = (error: unknown, position: ToastPosition = 'top-right') => {
    if (axios.isAxiosError(error)) {
        return toast.error(error.response?.data.message, { position: position });
    }

    if (error instanceof Error) {
        return toast.error(error.message, { position: position });
    }

    return toast.error("Network Error", { position: position });
}