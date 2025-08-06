import { StorageService } from '../local/storage-service'
import { baseApiErrorResponseSchema } from './types/root'
import { AuthError, backendApiWithAuth, user } from '.'
import type { InternalAxiosRequestConfig } from 'axios'

export async function RootResponseErrorInterceptor(responseError: any) {
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
}

export function AuthRequestInterceptor(
  config: InternalAxiosRequestConfig<any>,
) {
  const token = StorageService.getAccessToken()
  config.headers.Authorization = `Bearer ${token}`
  return config
}
export async function AuthRequestErrorInterceptor(error: any) {
  if (error instanceof AuthError) {
    console.error('Auth error:', error.message)
    user.logoutUser()
  }
  return Promise.reject(error)
}

export async function AuthResponseErrorInterceptor(error: any) {
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
      console.error('Server error:', error.response.data)
      return Promise.reject(error)
    }
  } else if (error.request) {
    return Promise.reject(error)
  }
  return Promise.reject(error)
}
