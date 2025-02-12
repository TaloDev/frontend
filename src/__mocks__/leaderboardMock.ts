import { Leaderboard, LeaderboardSortMode, LeaderboardRefreshInterval } from '../entities/leaderboard'

export default function leaderboardMock(extra: Partial<Leaderboard> = {}): Leaderboard {
  return {
    id: 1,
    internalName: 'score',
    name: 'Score',
    sortMode: LeaderboardSortMode.ASC,
    unique: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    refreshInterval: LeaderboardRefreshInterval.NEVER,
    ...extra
  }
}
