import refreshAccess from '../api/refreshAccess'

export default async (token) => {
  const encodedData = token.split('.')[1]
  const data = JSON.parse(atob(encodedData))
  const isValid = Date.now() < data.exp * 1000
  if (isValid) return token

  console.log('loop 2')
  const res = await refreshAccess()
  return res.data.accessToken
}
