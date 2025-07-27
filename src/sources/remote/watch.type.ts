import z from 'zod'
import { baseApiResponseSchema } from './root.type'

export const GetStreamingSchema = baseApiResponseSchema(
  z.string().optional(),
).extend({
  prediction: z
    .array(
      z.object({
        track_id: z.string(),
        name: z.string(),
        confidence: z.number(),
      }),
    )
    .optional(),
})
