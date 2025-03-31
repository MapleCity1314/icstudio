import Cookies from 'js-cookie'

// Cookie中存储Token的键名
const TokenKey = 'ic-token'

// Token过期时间（天）
const EXPIRE_DAYS = 7

/**
 * 从Cookie中获取Token
 */
export function getToken(): string | undefined {
  return Cookies.get(TokenKey)
}

/**
 * 将Token存储到Cookie中
 * @param token - JWT token字符串
 */
export function setToken(token: string): void {
  Cookies.set(TokenKey, token, { expires: EXPIRE_DAYS })
}

/**
 * 从Cookie中移除Token
 */
export function removeToken(): void {
  Cookies.remove(TokenKey)
}

/**
 * 清除所有认证相关的Cookie
 */
export function clearAuth(): void {
  removeToken()
}
