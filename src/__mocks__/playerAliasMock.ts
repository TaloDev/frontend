import { PlayerAlias, PlayerAliasService } from '../entities/playerAlias'
import playerMock from './playerMock'

export default function playerAliasMock(extra: Partial<PlayerAlias> = {}): PlayerAlias {
  return {
    id: 1,
    service: PlayerAliasService.STEAM,
    identifier: 'yxre12',
    player: playerMock(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...extra
  }
}
