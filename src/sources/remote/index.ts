import axios, { AxiosError } from 'axios'
import { parseErrorResponse } from '../utils'
import * as user from './routes/user.api'
import * as live from './routes/live.api'
import * as stream from './routes/stream.api'
import * as watch from './routes/watch.api'

import {
  AuthRequestErrorInterceptor,
  AuthRequestInterceptor,
  AuthResponseErrorInterceptor,
  RootResponseErrorInterceptor,
} from './interceptors'
import { env } from '@/env'
import { STREAM_URL } from '@/lib/constant'

class AuthError extends AxiosError {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

const backendApi = axios.create({
  baseURL: env.VITE_BACKEND_URL ?? undefined,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const streamApiWithAuth = axios.create({
  baseURL: STREAM_URL ?? undefined,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const backendApiWithAuth = backendApi.create({
  withCredentials: true,
})

backendApi.interceptors.response.use(
  (response) => response,
  RootResponseErrorInterceptor,
)

// setup interceptors for auth version of axios instance
backendApiWithAuth.interceptors.request.use(
  AuthRequestInterceptor,
  AuthRequestErrorInterceptor,
)
backendApiWithAuth.interceptors.response.use(
  (response) => response,
  AuthResponseErrorInterceptor,
)
streamApiWithAuth.interceptors.request.use(
  AuthRequestInterceptor,
  AuthRequestErrorInterceptor,
)
streamApiWithAuth.interceptors.response.use(
  (response) => response,
  AuthResponseErrorInterceptor,
)



/**
 * wraps and API calls with error handling and parsing
 * @template T - The type of the API response
 * @param apiFunction - The API function to call, found at `@/sources/api.ts`
 * @returns
 */
export const runApi = async <T>(apiFunction: () => Promise<T>) => {
  const result = await apiFunction().catch((error) => parseErrorResponse(error))
  return result
}

export { user, live, stream, watch }
export { AuthError }
export { backendApi, backendApiWithAuth, streamApiWithAuth }
