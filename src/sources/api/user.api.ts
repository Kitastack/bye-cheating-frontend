import { StorageService } from '../local/storage-service'
import {
  GetUserSchema,
  GetUsersSchema,
  LoginUserSchema,
  RefreshTokenUserSchema,
  RegisterUserSchema,
  UpdateUserSchema,
} from './user.type'
import { BACKEND_URL } from '@/lib/constant'

export const getUser = async () => {
  const accessToken = StorageService.getAccessToken()
  const response = await fetch(`${BACKEND_URL}/user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const body = await response.json()
  const sanitizedBody = GetUserSchema.parse(body)
  return sanitizedBody
}

export const getUsers = async () => {
  const accessToken = StorageService.getAccessToken()
  const response = await fetch(`${BACKEND_URL}/user/list`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const body = await response.json()
  const sanitizedBody = GetUsersSchema.parse(body)
  return sanitizedBody
}

export const updateUser = async (userData: { name?: string }) => {
  const accessToken = StorageService.getAccessToken()
  const response = await fetch(`${BACKEND_URL}/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(userData),
  })
  const body = await response.json()
  const sanitizedBody = UpdateUserSchema.parse(body)
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
  const accessToken = StorageService.getAccessToken()
  const response = await fetch(`${BACKEND_URL}/user/update`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(userData),
  })
  const body = await response.json()
  const sanitizedBody = UpdateUserSchema.parse(body)
  return sanitizedBody
}

export const registerUser = async (userData: {
  email: string
  name: string
  password: string
}) => {
  const response = await fetch(`${BACKEND_URL}/user/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
  const body = await response.json()
  const sanitizedBody = RegisterUserSchema.parse(body)
  return sanitizedBody
}

export const loginUser = async (credentials: {
  email: string
  password: string
}) => {
  const response = await fetch('/user/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })
  const body = await response.json()
  const sanitizedBody = LoginUserSchema.parse(body)

  StorageService.setAccessToken(sanitizedBody.result?.accessToken ?? '')
  StorageService.setRefreshToken(sanitizedBody.result?.refreshToken ?? '')
  return
}

export const logoutUser = () => {
  StorageService.clearTokens()
  return true
}

export const refreshToken = async () => {
  const response = await fetch(`${BACKEND_URL}/user/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${StorageService.getRefreshToken()}`,
    },
  })
  const body = await response.json()
  const sanitizedBody = RefreshTokenUserSchema.parse(body)

  StorageService.setAccessToken(sanitizedBody.result?.token ?? '')

  return sanitizedBody.result?.token ?? ''
}
