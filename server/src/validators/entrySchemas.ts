import { z } from 'zod'

export const entryCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['MOVIE', 'TV_SHOW'], { message: 'Type must be MOVIE or TV_SHOW' }),
  director: z.string().optional().transform(v => v === '' ? undefined : v),
  budget: z.union([z.number(), z.string().transform(v => v === '' ? undefined : Number(v))]).optional(),
  location: z.string().optional().transform(v => v === '' ? undefined : v),
  duration: z.string().optional().transform(v => v === '' ? undefined : v),
  yearOrTime: z.string().optional().transform(v => v === '' ? undefined : v),
  posterUrl: z.string()
    .optional()
    .transform(v => v === '' ? undefined : v)
    .refine(v => !v || /^https?:\/\/.+/.test(v), 'Must be a valid URL or empty'),
}).strict()

export const entryUpdateSchema = entryCreateSchema.partial().extend({
  id: z.number().optional()
})
