import { Player } from '../entities/player'
import gameMock from './gameMock'

export default function playerMock(extra: Partial<Player> = {}): Player {
  return {
    id: '031fcd24-8ac4-4a64-ab5e-e86d05e7fe89',
    props: [],
    devBuild: true,
    game: gameMock({ id: '1', name: 'Crawle' }),
    createdAt: new Date().toISOString(),
    lastSeenAt: new Date().toISOString(),
    aliases: [],
    groups: [],
    ...extra
  }
}
