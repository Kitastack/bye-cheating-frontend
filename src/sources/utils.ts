import { baseApiErrorResponseSchema } from './remote/root.type'
import type { AxiosError } from 'axios'
import type * as z from 'zod/mini'
/**
 * generic utils for parsing the body response using zod, with return type is generic object that merge with response code
 * * @param response  - Response object from fetch or any HTTP client
 * @param body - Response JSON object body from fetch or any HTTP client
 * @param schema - Zod schema to validate the response body
 * @returns - Promise resolving to an object containing the parsed body with response code
 */

export function parseResponse<T>(
  responseCode: number,
  body: unknown,
  schema: z.ZodMiniType<T>,
): T & { responseCode: number; responseStatus: null } {
  console.log('Parsing response with code:', responseCode, 'and body:', body)
  const parsedBody = schema.safeParse({ ...(body as object), responseCode })

  if (!parsedBody.success) {
    console.error('Response parsing error:', parsedBody.error)
    throw new Error('Failed to parse response body')
  }
  const result = parsedBody.data as T & {
    responseCode: number
    responseStatus: null
  }
  return result
}

export function parseErrorResponse(axiosError: AxiosError) {
  if (axiosError.response) {
    const { success, data, error } = baseApiErrorResponseSchema.safeParse({
      ...(axiosError.response.data as any),
      responseCode: axiosError.response.status,
    })
    return { ...data, responseStatus: axiosError.code || undefined,  }
  }
  if (axiosError.request) {
    console.error('Request error:', axiosError.message)
    return {
      responseCode: 0,
      success: false,
      responseStatus: axiosError.code || undefined,
      message: axiosError.message || 'Request error occurred',
    }
  }

  console.error('Network error:', axiosError.toJSON())
  return {
    responseCode: 0,
    success: false,
    responseStatus: axiosError.code || undefined,
    message: 'Network error occurred',
  }
}
