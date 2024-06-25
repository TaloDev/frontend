import { Game } from '../entities/game'

export default function gameMock(activeGameValue: { id: string, name: string }, extra: Partial<Game> = {}): Game {
  return {
    id: Number(activeGameValue.id),
    name: activeGameValue.name,
    props: [],
    playerCount: 0,
    createdAt: new Date().toISOString(),
    ...extra
  }
}
