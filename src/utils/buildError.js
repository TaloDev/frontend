export default (error) => {
  if (typeof error === 'string') {
    return { message: error }
  }

  if (error.response?.data?.message && Object.keys(error.response.data).length > 0) {
    return error.response.data
  }

  return { message: error.message }
}
