import { User } from "./User"

export interface AuthenticationInput {
  accessToken: string
}

export interface AuthenticationResponse {
  success: true
}

export interface RefreshTokenInput {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

export interface SignInInput {
  email: string
  password: string
}

export interface SignInResponse {
  user: User
  accessToken: string
  refreshToken: string
}