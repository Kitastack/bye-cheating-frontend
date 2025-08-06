const ACCESS_TOKEN = 'access_token'
const REFRESH_TOKEN = 'refresh_token'
const IS_AUTHENTICATED = 'is_authenticated'

export const StorageService = {
  getAccessToken: () => {
    return localStorage.getItem(ACCESS_TOKEN)
  },

  setAccessToken: (token: string) => {
    localStorage.setItem(ACCESS_TOKEN, token)
  },
  getRefreshToken: () => {
    return localStorage.getItem(REFRESH_TOKEN)
  },
  setRefreshToken: (token: string) => {
    localStorage.setItem(REFRESH_TOKEN, token)
  },
  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(REFRESH_TOKEN)
  },

  //  is auth
  setIsAuthenticated: (bool: boolean) => {
    // console.log('authStorageStatus ', bool)
    localStorage.setItem(IS_AUTHENTICATED, String(bool))
  },
  getIsAuthenticated: () => {
    const value = localStorage.getItem(IS_AUTHENTICATED)
    // console.log('authStorageStatus get ', value)
    return value === 'true'
  },
}
