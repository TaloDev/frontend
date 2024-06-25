import { Player } from '../entities/player'

export default function playerMock(extra: Partial<Player> = {}): Player {
  return {
    id: '031fcd24-8ac4-4a64-ab5e-e86d05e7fe89',
    props: [],
    devBuild: true,
    createdAt: new Date().toISOString(),
    lastSeenAt: new Date().toISOString(),
    aliases: [],
    groups: [],
    ...extra
  }
}
