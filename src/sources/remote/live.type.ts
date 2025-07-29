import z from 'zod/mini'
import { baseApiResponseSchema } from './root.type'

export const LiveSchema = z.object({
  id: z.string(),
  url: z.string(),
  streamId: z.string(),
  userId: z.string(),
  expiryDate: z.optional(z.string()),
  createdDate: z.string(),
  updatedDate: z.optional(z.string()),
})

export const GetLivesSchema = baseApiResponseSchema(z.array(LiveSchema))
export const CreateLiveSchema = baseApiResponseSchema(
  z.extend(LiveSchema, {
    isPredictionEnabled: z.boolean(),
    path: z.string(),
    reportId: z.optional(z.string()),
    expiryTimeInMinutes: z.optional(z.number()),
  }),
)

export const UpdateLiveSchema = baseApiResponseSchema(LiveSchema)
