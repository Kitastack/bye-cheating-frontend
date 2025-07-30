import * as z from 'zod/mini'
import { baseApiResponseSchema } from './root.type'

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  roles: z.array(z.string()),
  isVerified: z.boolean(),
  createdDate: z.string(),
  updatedDate: z.nullish(z.string()),
  photo: z.nullish(z.string()),
})

export const GetUserSchema = baseApiResponseSchema(UserSchema)

export const GetUsersSchema = baseApiResponseSchema(z.array(UserSchema))

export const UpdateUserSchema = baseApiResponseSchema(UserSchema)
export const UpdateUserPOSTSchema = z.object({
  id: z.string(),
  name: z.nullish(z.string()),
  email: z.nullish(z.string()),
  photo: z.nullish(z.string()),
})

export const LoginUserSchema = baseApiResponseSchema(
  z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
)

export const RegisterUserSchema = baseApiResponseSchema(UserSchema)

export const RefreshTokenUserSchema = baseApiResponseSchema(
  z.object({
    token: z.string(),
  }),
)
