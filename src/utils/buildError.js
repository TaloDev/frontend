export default (error) => {
  let message = ''
  let keys = {}, extra = {}

  if (typeof error === 'string') {
    message = error
  } else if (error.response?.data?.message) {
    message = error.response.data.message
    extra = Object.keys(error.response.data).reduce((acc, key) => {
      if (key !== 'message') {
        return { ...acc, [key]: error.response.data[key] }
      }
      return acc
    }, {})
  } else if (error.response?.data?.errors) {
    message = 'Something went wrong, please try again later'
    keys = error.response.data.errors
    extra = Object.keys(error.response.data).reduce((acc, key) => {
      if (key !== 'errors') {
        return { ...acc, [key]: error.response.data[key] }
      }
      return acc
    }, {})
  } else {
    message = error.message
  }

  return {
    message,
    keys,
    hasKeys: Object.keys(keys).length > 0,
    extra
  }
}
