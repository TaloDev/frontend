export default function nullableNumber(val: unknown) {
  if (val === '' || val === null || typeof val === 'undefined') return null
  return Number(val)
}
