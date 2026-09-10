import { type FC, type ReactNode, type SyntheticEvent } from "react"

export type FormDataType = Record<string, string>;

interface FormInterface {
    children: ReactNode;
    className: string;
    reset?: boolean
    onValue?: (data: Record<string, string>) => void
}
const Form: FC<FormInterface> = ({ children, className, onValue, reset = false }) => {
    const handleForm = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const data: FormDataType = {}
        formData.forEach((value, name) => {
            data[name] = value.toString();
        })

        if (onValue) {
            onValue(data)
            reset && form.reset()
        }


    }
    return (
        <form className={className} onSubmit={handleForm}>
            {children}
        </form>
    )
}

export default Form
