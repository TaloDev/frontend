import type { SetStateAction } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { Game } from '../entities/game'

export const activeGameState = atomWithStorage<Game | null>(
  'activeGame',
  null,
  createJSONStorage(() => localStorage),
  { getOnInit: true },
)

export type SelectedActiveGame = NonNullable<Game>
export type SelectedActiveGameState = [
  SelectedActiveGame,
  (action: SetStateAction<Game | null>) => void,
]
