import refreshAccess from '../api/refreshAccess'

export default async (token) => {
  const encodedData = token.split('.')[1]
  const data = JSON.parse(atob(encodedData))
  const isValid = Date.now() < data.exp * 1000
  if (isValid) return token

  const res = await refreshAccess()
  return res.data.accessToken
}
