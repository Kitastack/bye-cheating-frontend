import z from 'zod'

export interface BaseApiResponse<T> {
  success: boolean
  result?: T
  message?: string
}

export const baseApiResponseSchema = <T>(resultSchema: z.ZodType<T>) =>
  z.object({
    success: z.boolean(),
    result: resultSchema.optional(),
    message: z.string().optional(),
  })
