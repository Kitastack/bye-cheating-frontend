import { z } from 'zod'
import type { BaseApiResponse } from '@/sources/api/root.type'
import { baseApiResponseSchema } from '@/sources/api/root.type'

type User = {
  id: string
  email: string
  name: string
  roles: Array<string>
  isVerified: boolean
  createdDate: string
  updatedDate?: string
  photo?: string
}
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  roles: z.array(z.string()),
  isVerified: z.boolean(),
  createdDate: z.string(),
  updatedDate: z.string().optional(),
  photo: z.string().optional(),
})

export type GetUser = BaseApiResponse<User>
export const GetUserSchema = baseApiResponseSchema<User>(UserSchema)

export type GetUsers = BaseApiResponse<Array<User>>
export const GetUsersSchema = baseApiResponseSchema<Array<User>>(
  z.array(UserSchema),
)

export type UpdateUser = BaseApiResponse<User>
export const UpdateUserSchema = baseApiResponseSchema<User>(UserSchema)
export const UpdateUserPOSTSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  photo: z.string().optional(),
})

export type LoginUser = BaseApiResponse<
  User & {
    accessToken: string
    refreshToken: string
  }
>
export const LoginUserSchema = baseApiResponseSchema<
  User & { accessToken: string; refreshToken: string }
>(
  UserSchema.extend({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
)

export type RegisterUser = BaseApiResponse<User>
export const RegisterUserSchema = baseApiResponseSchema<User>(UserSchema)

export type RefreshTokenUser = BaseApiResponse<{ token: string }>
export const RefreshTokenUserSchema = baseApiResponseSchema<{ token: string }>(
  z.object({
    token: z.string(),
  }),
)
