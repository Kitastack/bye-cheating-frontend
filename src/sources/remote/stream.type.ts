import z from 'zod'
import { baseApiResponseSchema } from './root.type'

export const StreamSchema = z.object({
  id: z.string(),
  url: z.string(),
  userId: z.string(),
  createdDate: z.string(),
  updatedDate: z.string().optional(),
})

export const GetStreamsSchema = baseApiResponseSchema(z.array(StreamSchema))

export const CreateStreamSchema = baseApiResponseSchema(StreamSchema)

export const UpdateStreamSchema = baseApiResponseSchema(StreamSchema)

export const DeleteStreamSchema = baseApiResponseSchema(z.string().optional())
