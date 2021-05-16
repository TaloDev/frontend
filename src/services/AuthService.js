const AuthService = (() => {
  let _token = null

  const getToken = () => {
    return _token
  }

  const setToken = (token) => {
    _token = token
  }

  return {
    getToken,
    setToken
  }
 })()

 export default AuthService
