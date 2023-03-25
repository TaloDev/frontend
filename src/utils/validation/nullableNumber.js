export default function nullableNumber(val) {
  if ([null, undefined, ''].includes(val)) return null
  return Number(val)
}
