export type ResetMode = 'dev' | 'live' | 'all'

type ResetModeOption = {
  label: string
  desc: string
  value: ResetMode
}

export const resetModeOptions: ResetModeOption[] = [
  { label: 'Dev players', desc: 'Delete entries from players created in dev builds', value: 'dev' },
  {
    label: 'Live players',
    desc: 'Delete entries from players created in live builds',
    value: 'live',
  },
  { label: 'All players', desc: 'Delete entries from all players', value: 'all' },
]
