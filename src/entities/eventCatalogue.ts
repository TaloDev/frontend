import { z } from 'zod'

export const catalogueEventSchema = z.object({
  name: z.string(),
  count: z.number(),
  players: z.number(),
  propKeys: z.array(z.string()),
  retentionDays: z.number().nullable(),
})

export type CatalogueEvent = z.infer<typeof catalogueEventSchema>

export const eventCatalogueSchema = z.object({
  events: z.array(catalogueEventSchema),
  count: z.number(),
  itemsPerPage: z.number(),
  isLastPage: z.boolean(),
})

export const eventRetentionSchema = z.object({
  eventName: z.string(),
  retentionDays: z.number(),
  updatedAt: z.string(),
})
