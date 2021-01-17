export default (token) => {
  const data = atob(token.split('.')[1])
  return new Date() < data.exp
}
