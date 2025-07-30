import axios, { AxiosError } from 'axios'
import * as user from './remote/user.api'
import * as live from './remote/live.api'
import * as stream from './remote/stream.api'
import * as watch from './remote/watch.api'

import { baseApiErrorResponseSchema } from './remote/root.type'
import { parseErrorResponse } from './utils'
import { env } from '@/env'
import { StorageService } from '@/sources/local/storage-service'

class AuthError extends AxiosError {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

const backendApi = axios.create({
  baseURL: env.VITE_BACKEND_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const backendApiWithAuth = backendApi.create({
  withCredentials: true,
})

backendApi.interceptors.response.use(
  (response) => response,
  (responseError) => {
    if (responseError.response) {
      const { data, error, success } = baseApiErrorResponseSchema.safeParse({
        ...responseError.response.data,
        responseCode: responseError.response.status,
      })
      if (!success) return Promise.reject(error)
      console.error('Response error:', data.message)
    }
    if (responseError.request) {
      console.error('Network error:', responseError.message)
      return Promise.reject(responseError)
    }
    console.error('Request error:', responseError.message)
    return Promise.reject(responseError)
  },
)

// setup interceptors for auth version of axios instance
backendApiWithAuth.interceptors.request.use(
  (config) => {
    const token = StorageService.getAccessToken()
    config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error: AxiosError) => {
    if (error instanceof AuthError) {
      console.error('Auth error:', error.message)
      user.logoutUser()
    }
    return Promise.reject(error)
  },
)
backendApiWithAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('Response error:', error)
    if (error.response) {
      if (error.response.status === 403 && !error.config._retry) {
        error.config._retry = true
        try {
          await user.refreshToken()
          return backendApiWithAuth.request(error.config)
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError)
          user.logoutUser()
          return Promise.reject(new AuthError('Failed to refresh token'))
        }
      } else if (error.response.status >= 500) {
        // Handle server errors
        console.error('Server error:', error.response.data)
      }
      if (error instanceof AxiosError) {
      }
    } else if (error.request) {
      // Handle network errors
      console.error('Network error:', error.message)
      return Promise.reject(error)
    }
    return Promise.reject(error)
  },
)

const defaultResult = {
  responseCode: 0,
  success: false,
  result: null,
  message: '',
}

/**
 * wraps and API calls with error handling and parsing
 * @template T - The type of the API response
 * @param apiFunction - The API function to call, found at `@/sources/api.ts`
 * @returns 
 */
export const runApi = async <T>(apiFunction: () => Promise<T>) => {
  const result = await apiFunction().catch((error) => parseErrorResponse(error))
  return result ?? defaultResult 
}
export { user, live, stream, watch }
export { AuthError }
export { backendApi, backendApiWithAuth }
