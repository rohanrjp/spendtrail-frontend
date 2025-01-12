import { getToken } from "./auth"

export const apiCall = async (url: string, options: RequestInit = {}) => {
  const token = getToken()
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error('API call failed')
  }

  return response.json()
}

