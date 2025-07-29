import z from 'zod/mini'
import { baseApiResponseSchema } from './root.type'

export const StreamSchema = z.object({
  id: z.string(),
  url: z.string(),
  userId: z.string(),
  createdDate: z.string(),
  updatedDate: z.optional(z.string()),
})

export const GetStreamsSchema = baseApiResponseSchema(z.array(StreamSchema))

export const CreateStreamSchema = baseApiResponseSchema(StreamSchema)

export const UpdateStreamSchema = baseApiResponseSchema(StreamSchema)

export const DeleteStreamSchema = baseApiResponseSchema(z.optional(z.string()))
