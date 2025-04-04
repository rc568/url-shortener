'use client'

import { Link } from "@/app/interfaces"
import { deleteLink } from "@/server/actions/link"
import { LucideCopy, LucideTrash } from "lucide-react"
import { toast } from "sonner"
import ShortEdit from "./ShortEdit"

const ShortCard = (props: Link) => {

    const { id, slug, url, visits } = props

    const handleCopy = () => {
        const URL = `${process.env.NEXT_PUBLIC_URL}/${slug}`

        navigator.clipboard.writeText(URL).then(() => {
            toast.success('Copied to clipboard.', {
                description: `${URL}`,
            })
        })
    }

    const handleDelete = (id: number) => {
        toast.promise(deleteLink(id), {
            success: 'Deleted sucessfully',
            error: 'Error deleting link',
        })
    }

    return <article className="border border-slate-200 rounded-md p-4">
        <div className="flex items-center justify-between gap-2">
            <span className="font-bold">/{slug}</span>

            <div className="flex items-center gap-4">
                <small>{visits} clicks</small>
                <div className="flex items-center gap-2">
                    <button className="cursor-pointer bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold p-2 rounded-md" onClick={handleCopy}>
                        <LucideCopy size={14} />
                    </button>
                    <ShortEdit {...props} />
                    <button className="cursor-pointer bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold p-2 rounded-md" onClick={() => handleDelete(id)}>
                        <LucideTrash size={14} />
                    </button>
                </div>
            </div>
        </div>
        <div className="text-sm text-slate-800 mt-4 text-ellipsis overflow-hidden whitespace-nowrap">
            {url}
        </div>
    </article>
}

export default ShortCard