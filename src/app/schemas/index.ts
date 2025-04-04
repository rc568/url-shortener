import { InferType, object, string } from "yup";

export const createLinkSchema = object({
    url: string().min(1, 'URL is required.').url('Please enter a valid URL: https:// or http://').required(),
    slug: string().min(4, 'Slug must be at least 5 characters long.').matches(/^[a-zA-Z0-9-_]+$/, 'Slug can only contain letters, numbers, dashes and underscores.').required(),
})

export type CreateLink = InferType<typeof createLinkSchema>;