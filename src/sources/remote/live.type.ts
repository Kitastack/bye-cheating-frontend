import * as z from 'zod/mini'
import { baseApiResponseSchema } from './root.type'

export const LiveSchema = z.object({
  id: z.string(),
  url: z.string(),
  streamId: z.string(),
  userId: z.string(),
  expiryDate: z.nullish(z.string()),
  createdDate: z.string(),
  updatedDate: z.nullish(z.string()),
})

export const GetLivesSchema = baseApiResponseSchema(z.array(LiveSchema))
export const CreateLiveSchema = baseApiResponseSchema(
  z.extend(LiveSchema, {
    isPredictionEnabled: z.boolean(),
    path: z.string(),
    reportId: z.nullish(z.string()),
    expiryTimeInMinutes: z.nullish(z.number()),
  }),
)

export const UpdateLiveSchema = baseApiResponseSchema(LiveSchema)
