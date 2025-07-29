import z from 'zod/mini'
import { baseApiResponseSchema } from './root.type'

export const GetStreamingSchema = z.extend(
  baseApiResponseSchema(z.optional(z.string())),
  {
    prediction: z.optional(
      z.array(
        z.object({
          track_id: z.string(),
          name: z.string(),
          confidence: z.number(),
        }),
      ),
    ),
  },
)
