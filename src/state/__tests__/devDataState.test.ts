import { describe, expect, it, vi } from 'vitest'

vi.hoisted(() => {
  localStorage.setItem('includeDevData', 'false')
})

import { getDefaultStore } from 'jotai'
import { devDataState } from '../devDataState'

describe('devDataState', () => {
  it('reflects the stored value even before any component mounts it', () => {
    expect(getDefaultStore().get(devDataState)).toBe(false)
  })
})
