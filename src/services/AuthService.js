const AuthService = (() => {
  let _token = null

  const getToken = () => {
    return _token
  }

  const setToken = (token) => {
    _token = token
  }

  const reload = () => {
    window.localStorage.setItem('loggedOut', 'true')
    window.location.reload()
  }

  return {
    getToken,
    setToken,
    reload
  }
 })()

 export default AuthService
