import { StorageService } from '../../local/storage-service'
import { parseResponse } from '../../utils'
import {
  GetUserSchema,
  GetUsersSchema,
  LoginUserSchema,
  RefreshTokenUserSchema,
  RegisterUserSchema,
  UpdateUserSchema,
} from '../types/user.api'
import { backendApi, backendApiWithAuth } from '..'
import { router } from '@/router'

export const getUser = async () => {
  const response = await backendApiWithAuth.get(`/user`)
  const body = response.data
  const sanitizedBody = parseResponse(response.status, body, GetUserSchema)
  return sanitizedBody
}

export const getUsers = async () => {
  const response = await backendApiWithAuth.get(`/user/list`)
  const body = await response.data
  const sanitizedBody = parseResponse(response.status, body, GetUsersSchema)
  return sanitizedBody
}

export const updateUser = async (userData: { name?: string }) => {
  const response = await backendApiWithAuth.patch(`/user`, userData)
  const body = await response.data
  const sanitizedBody = parseResponse(response.status, body, UpdateUserSchema)
  return sanitizedBody
}

/**
 * Update user information by admin
 * @param userData
 * @returns
 */
export const updateUserAdmin = async (userData: {
  id: string
  name?: string
  email?: string
  photo?: string
}) => {
  const response = await backendApiWithAuth.patch(`/user/update`, userData)
  const body = await response.data
  const sanitizedBody = parseResponse(response.status, body, UpdateUserSchema)
  return sanitizedBody
}

export const registerUser = async (userData: {
  email: string
  name: string
  password: string
}) => {
  const response = await backendApiWithAuth.post(`/user/signup`, userData)
  const body = await response.data
  const sanitizedBody = parseResponse(response.status, body, RegisterUserSchema)
  return sanitizedBody
}

export const loginUser = async (credentials: {
  email: string
  password: string
}) => {
  const response = await backendApi.post('/user/signin', credentials)

  const sanitizedBody = parseResponse(
    response.status,
    response.data,
    LoginUserSchema,
  )
  StorageService.setAccessToken(sanitizedBody.result?.accessToken ?? '')
  StorageService.setRefreshToken(sanitizedBody.result?.refreshToken ?? '')
  StorageService.setIsAuthenticated(true)
  return sanitizedBody
}
/**
 * logout user, and redirect to login page
 */
export const logoutUser = () => {
  StorageService.clearTokens()
  StorageService.setIsAuthenticated(false)
  router.navigate({ to: '/login', replace: true })
}

/**
 * refreshes the access token using the refresh token.
 * you don't need to pass the refresh token, it is stored in localStorage by using this function
 * @returns
 */
export const refreshToken = async () => {
  const token = StorageService.getRefreshToken()
  const response = await backendApiWithAuth.post(`/user/token`, {
    token: token,
  })
  const body = await response.data
  const sanitizedBody = parseResponse(
    response.status,
    body,
    RefreshTokenUserSchema,
  )
  StorageService.setAccessToken(sanitizedBody.result?.token ?? '')
  StorageService.setIsAuthenticated(true)

  return {
    responseCode: sanitizedBody.responseCode,
    success: sanitizedBody.success,
    result: sanitizedBody.result?.token,
    message: sanitizedBody.message,
  }
}
