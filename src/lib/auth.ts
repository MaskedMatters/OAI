export const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

export interface OAIUser {
  name: string
  orcid: string
  token: string
}

export function getUser(): OAIUser | null {
  const raw = localStorage.getItem('oai_user')
  if (!raw) return null
  try {
    return JSON.parse(raw) as OAIUser
  } catch {
    return null
  }
}

export function setUser(user: OAIUser): void {
  localStorage.setItem('oai_user', JSON.stringify(user))
}

export function clearUser(): void {
  localStorage.removeItem('oai_user')
}

export function triggerOrcidLogin(): void {
  const clientId = 'APP-E5T5KROSCZAJNFFZ'
  const redirectUri = encodeURIComponent(window.location.origin + '/auth-callback')
  const scope = encodeURIComponent('openid')
  const responseType = encodeURIComponent('token id_token')
  const nonce = encodeURIComponent(Math.random().toString(36).substring(2, 15))
  const authUrl = `https://orcid.org/oauth/authorize?client_id=${clientId}&response_type=${responseType}&scope=${scope}&redirect_uri=${redirectUri}&nonce=${nonce}`
  window.location.href = authUrl
}
