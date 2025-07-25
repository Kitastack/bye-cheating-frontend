import z from 'zod'
import { baseApiResponseSchema } from './root.type'

export const LiveSchema = z.object({
  id: z.string(),
  url: z.string(),
  streamId: z.string(),
  userId: z.string(),
  expiryDate: z.string().optional(),
  createdDate: z.string(),
  updatedDate: z.string().optional(),
})

export const GetLivesSchema = baseApiResponseSchema(z.array(LiveSchema))
export const CreateLiveSchema = baseApiResponseSchema(LiveSchema.extend({
  isPredictionEnabled: z.boolean(),
  path: z.string(),
  reportId: z.string().optional(),
  expiryTimeInMinutes: z.number().optional(),
}))

export const UpdateLiveSchema = baseApiResponseSchema(LiveSchema)