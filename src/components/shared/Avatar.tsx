import type { FC, ReactNode } from "react";

interface AvatarInterface {
    title?: string | null;
    subtitle?: ReactNode;
    image?: string;
    titleColur?: string;
    subtitleColour?: string;
    size?: "lg" | "md";
    key?: string | number;
}
const Avatar: FC<AvatarInterface> = ({ key = 0, size = "lg", title, subtitle = "subtitle is missing", image, titleColur = "#000000", subtitleColour = "#f5f5f5" }) => {
    return (
        <div key={key} className="flex gap-3 items-center">

            {
                image &&
                <img
                    src={image}
                    className={`${size === "lg" ? "w-12 h-12" : "w-8 h-8"} rounded-full object-cover`}
                />
            }

            {
                (title && subtitle) &&
                <div className="flex flex-col">
                    <h1 className={`${size === "lg" ? "text-lg/6" : "text-sm"} font-medium capitalize`} style={{ color: titleColur }}>{title}</h1>
                    <div style={{ color: subtitleColour }}>
                        {subtitle}
                    </div>
                </div>
            }
        </div>
    )
}

export default Avatar

