'use server';

import { eq, desc } from "drizzle-orm";

import { db } from "@/server/db";
import { CreateLink } from "@/app/schemas";
import { linksTable } from "@/server/db/schema";
import { revalidatePath } from "next/cache";

export const getLinksByPage = async (page: number = 1, limit: number = 24) => {
    const links = await db.select().from(linksTable).orderBy(desc(linksTable.id)).limit(limit).offset((page - 1) * limit);
    return links
}

export const checkSlugExists = async (slug: string) => {
    const response = await db.select().from(linksTable).where(eq(linksTable.slug, slug)).get();

    if (response) {
        return true;
    }
    return false;
}

export const createLink = async (values: CreateLink) => {
    await db.insert(linksTable).values({ ...values, visits: 0 });
    revalidatePath('/'); // Revalidar la ruta para que se actualice el cache
}
