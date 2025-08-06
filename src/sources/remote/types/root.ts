import * as z from 'zod/mini'

export interface BaseApiResponse<T> {
  success: boolean
  result?: T
  message?: string
}

export const baseApiResponseSchema = <T>(resultSchema: z.ZodMiniType<T>) =>
  z.object({
    responseCode: z.number(),
    success: z.boolean(),
    result: z.nullish(resultSchema),
    message: z.nullish(z.string()),
  })

export const baseApiErrorResponseSchema = z.object({
  responseCode: z.number(),
  success: z.boolean(),
  message: z.string(),
})
export type BaseApiErrorResponse = z.infer<typeof baseApiErrorResponseSchema>