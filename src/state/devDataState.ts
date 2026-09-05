import { atomWithStorage } from 'jotai/utils'

export const devDataState = atomWithStorage('includeDevData', true, undefined, { getOnInit: true })
