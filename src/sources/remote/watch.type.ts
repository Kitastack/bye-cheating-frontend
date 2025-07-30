import * as z from 'zod/mini'
import { baseApiResponseSchema } from './root.type'

export const GetStreamingSchema = z.extend(
  baseApiResponseSchema(z.nullish(z.string())),
  {
    prediction: z.nullish(
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
