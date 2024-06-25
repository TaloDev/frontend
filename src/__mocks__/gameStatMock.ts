import { GameStat } from '../entities/gameStat'

export default function gameStatMock(extra: Partial<GameStat> = {}): GameStat {
  return {
    id: 1,
    internalName: 'hearts-collected',
    name: 'Hearts collected',
    global: false,
    globalValue: 5,
    minValue: null,
    defaultValue: 5,
    maxValue: null,
    maxChange: null,
    minTimeBetweenUpdates: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...extra
  }
}
