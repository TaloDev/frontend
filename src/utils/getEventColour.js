import randomColor from 'randomcolor'

export default (eventName) => {
  return randomColor({ seed: eventName })
}
