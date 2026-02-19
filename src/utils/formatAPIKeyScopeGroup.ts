// playerPresence -> Player Presence
export function formatAPIKeyScopeGroup(name: string) {
  return name.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())
}
