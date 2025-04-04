'use client';

import { LucideDices, Link, LucideDice1, LucideDice6, Loader } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CreateLink, createLinkSchema } from "@/app/schemas/"
import { yupResolver } from "@hookform/resolvers/yup";
import { checkSlugExists, createLink } from "@/server/actions/link";
import { toast } from "sonner";

const URL = process.env.NEXT_PUBLIC_URL;

const ShortForm = () => {

    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<CreateLink>({
        resolver: yupResolver(createLinkSchema),
    })

    const onSubmit = async (values: CreateLink) => {
        try {
            setIsLoading(true);
            const slugExists = await checkSlugExists(values.slug)

            if (slugExists) {
                toast.error('Slug already exists. Please choose another one.')
                return
            }

            await createLink(values)
            toast.success('Link created succesfully!', {
                description: `Your shortened URL created is: ${URL}/${values.slug}`,
                closeButton: true,
            })

            reset()
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }

    const onRandomSlug = () => {
        let randomSlug = '';
        do {
            randomSlug = Math.floor(Math.random() * 10000000).toString(36);
        } while (randomSlug.length < 5);
        setValue("slug", randomSlug);
    }

    return (
        <form className="flex flex-col gap-4 bg-slate-50 border-slate-300 border rounded-lg shadow-sm my-4 px-8 py-4"
            onSubmit={handleSubmit(onSubmit)}>
            <div>
                <div className="flex gap-2 items-center">
                    <label>URL:</label>
                    <input
                        placeholder="https://ejemplo.com"
                        className="border border-gray-300 rounded-md focus-within:outline focus-within:outline-slate-400 grow px-2 pt-1"
                        {...register("url")}
                    />
                </div>
                {
                    errors.url && (<small className="text-red-500 inline-block">{errors.url.message}</small>)
                }
            </div>


            <div>
                <div className="flex gap-2 items-center">
                    <label htmlFor="shortener">Acortador:</label>
                    <input
                        placeholder="Escriba o genere uno aleatoriamente"
                        className="border border-gray-300 rounded-md focus-within:outline focus-within:outline-slate-400 grow px-2 py-1"
                        {...register("slug")}
                    />
                    <button type="button" className="flex gap-2 items-center bg-slate-600 text-slate-50 px-4 py-2 rounded-md cursor-pointerhover:bg-slate-800 transition-colors cursor-pointer" onClick={onRandomSlug}>
                        Aleatorio
                        <LucideDices size={24} />
                    </button>
                </div>
                {
                    errors.slug && (<small className="text-red-500">{errors.slug.message}</small>)
                }
            </div>


            <button type="submit" className="flex gap-2 items-center bg-slate-600 text-slate-50 px-4 py-2 rounded-md cursor-pointer hover:bg-slate-800 transition-colors w-fit mx-auto">
                Crear acortador
                {
                    isLoading ? <Loader size={24} className="animate-spin" /> : <Link size={24} />
                }

            </button>
        </form>
    );
}

export default ShortForm;

function setValue(arg0: string, randomSlug: string) {
    throw new Error("Function not implemented.");
}
