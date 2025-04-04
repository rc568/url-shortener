'use server';

import { eq, desc } from "drizzle-orm";

import { db } from "@/server/db";
import { CreateLink } from "@/app/schemas";
import { linksTable } from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import { LinkFromServerResponse } from "@/server/interfaces";

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

export const deleteLink = async (id: number) => {
    await db.delete(linksTable).where(eq(linksTable.id, id));
    revalidatePath('/'); // Revalidar la ruta para que se actualice el cache
}

export const getLinkToRedirect = async (
    slug: string
): Promise<LinkFromServerResponse> => {
    try {
        const link = await db
            .select()
            .from(linksTable)
            .where(eq(linksTable.slug, slug))
            .get()

        if (!link) {
            return {
                error: true,
                message: 'Link not found.',
                redirect404: true
            }
        }

        // Update visits
        await db
            .update(linksTable)
            .set({ visits: link.visits + 1 })
            .where(eq(linksTable.id, link.id))

        return {
            error: false,
            message: 'Link found.',
            url: link.url,
        }

    } catch {
        return {
            error: true,
            message: 'Error fetching link.',
        }
    }
}

export const updateLink = async (id: number, values: CreateLink) => {
    await db
        .update(linksTable)
        .set({ ...values })
        .where(eq(linksTable.id, id))

    revalidatePath('/')
}