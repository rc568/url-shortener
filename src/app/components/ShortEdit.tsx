
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader, LucideFilePen, X } from "lucide-react";
import { toast } from "sonner";

import { Link } from "@/app/interfaces";
import { CreateLink, createLinkSchema } from "@/app/schemas";
import { checkSlugExists, updateLink } from "@/server/actions/link";

const ShortEdit = (props: Link) => {

    const { id, slug, url } = props

    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<CreateLink>({
        resolver: yupResolver(createLinkSchema),
        values: {
            slug: props.slug,
            url: props.url,
        }
    })

    const onSubmit = async (values: CreateLink) => {
        try {
            setIsLoading(true)
            const slugExists = await checkSlugExists(values.slug)

            if (slugExists) {
                toast.error('Slug already exists. Please choose another one.')
                return
            }

            await updateLink(id, values)
            toast.success('Link updated succesfully!')
        } catch {
            toast.error('Error updating link.')
        } finally {
            setIsLoading(false)
            setIsOpen(false)
        }
    }

    return <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger asChild>
            <button className="cursor-pointer bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold p-2 rounded-md">
                <LucideFilePen size={14} />
            </button>
        </Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-slate-950/80 data-[state=open]:animate-overlayShow" />
            <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-slate-100 p-6 shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow">
                <Dialog.Title className="flex justify-between items-center">
                    <span className="text-slate-950 font-bold text-lg">
                        Editar Acortador
                    </span>
                    <Dialog.Close className="cursor-pointer">
                        <X size={24} />
                    </Dialog.Close>
                </Dialog.Title>

                <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <div className="flex gap-2 items-center">
                            <label className="w-24 text-right">URL:</label>
                            <input
                                placeholder={url}
                                className="border border-gray-300 rounded-md focus-within:outline focus-within:outline-slate-400 grow px-2 pt-1 text-slate-800"
                                {...register('url')}
                            />
                        </div>
                        {
                            errors.url && (<small className="text-red-500 w-full text-right inline-block">{errors.url.message}</small>)
                        }
                    </div>

                    <div className="my-4">
                        <div className="flex gap-2 items-center">
                            <label className="w-24 text-right">Acortador:</label>
                            <input
                                placeholder={slug}
                                className="border border-gray-300 rounded-md focus-within:outline focus-within:outline-slate-400 grow px-2 pt-1 text-slate-800"
                                {...register('slug')}
                            />
                        </div>
                        {
                            errors.slug && (<small className="text-red-500 w-full text-right inline-block">{errors.slug.message}</small>)
                        }
                    </div>

                    <button type="submit" className="flex gap-2 items-center bg-slate-600 text-slate-50 px-4 py-2 rounded-md cursor-pointer hover:bg-slate-800 transition-colors w-fit mx-auto">
                        Guardar cambios
                        {
                            isLoading ? <Loader size={24} className="animate-spin" /> : <></>
                        }
                    </button>
                </form>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
}

export default ShortEdit