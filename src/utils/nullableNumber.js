export default function(val) {
  if ([null, undefined, ''].includes(val)) return null
  return Number(val)
}
