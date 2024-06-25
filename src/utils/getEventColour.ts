import randomColor from 'randomcolor'

export default (eventName: string) => {
  return randomColor({ seed: eventName })
}
