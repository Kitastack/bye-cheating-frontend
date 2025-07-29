import z from 'zod/mini'

export interface BaseApiResponse<T> {
  success: boolean
  result?: T
  message?: string
}

export const baseApiResponseSchema = <T>(resultSchema: z.ZodMiniType<T>) =>
  z.object({
    success: z.boolean(),
    result: z.optional(resultSchema),
    message: z.optional(z.string()),
  })
