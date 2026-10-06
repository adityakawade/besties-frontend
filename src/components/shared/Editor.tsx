import { CKEditor } from '@ckeditor/ckeditor5-react'
import {
    ClassicEditor,
    Essentials,
    Paragraph,
    Heading,
    Bold,
    Italic,
    List,
    Undo
} from 'ckeditor5'

import 'ckeditor5/ckeditor5.css'
import type { FC } from 'react'

const toolbars: string[] = [
    "heading",
    "|",
    "bold",
    "italic",
    "|",
    "numberedList",
    "bulletedList",
    "|",
    "undo",
    "redo"
]

interface EditorProps {
    value: string
    setValue: (value: string) => void
}

const Editor: FC<EditorProps> = ({ value, setValue }) => {

    const handleChange = (_: unknown, editor: any) => {
        const v = editor.getData()
        setValue(v)
    }

    return (
        <CKEditor
            editor={ClassicEditor}
            data={value}
            config={{
                licenseKey: 'GPL',
                plugins: [
                    Essentials,
                    Paragraph,
                    Heading,
                    Bold,
                    Italic,
                    List,
                    Undo
                ],
                toolbar: toolbars
            }}
            onChange={handleChange}
        />
    )
}

export default Editor