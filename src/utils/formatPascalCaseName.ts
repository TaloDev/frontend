// playerPresence -> Player Presence
export function formatPascalCaseName(name: string) {
  return name.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())
}
