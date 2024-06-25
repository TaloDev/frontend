import useSWR from 'swr'
import buildError from '../utils/buildError'
import prepareRule from '../utils/group-rules/prepareRule'
import isGroupRuleValid from '../utils/group-rules/isGroupRuleValid'
import { useMemo } from 'react'
import { Game } from '../entities/game'
import { UnpackedGroupRule } from '../modals/groups/GroupDetails'
import { PlayerGroupRuleMode } from '../entities/playerGroup'
import makeValidatedGetRequest from './makeValidatedGetRequest'
import { z } from 'zod'

export default function useGroupPreviewCount(activeGame: Game, ruleMode: PlayerGroupRuleMode, rules: UnpackedGroupRule[]) {
  const fetcher = async ([url]: [string]) => {
    const qs = new URLSearchParams({
      ruleMode,
      rules: JSON.stringify(rules.map(prepareRule))
    }).toString()

    const res = await makeValidatedGetRequest(`${url}?${qs}`, z.object({
      count: z.number()
    }))

    return res
  }

  const allValid = useMemo(() => {
    return rules.every(isGroupRuleValid)
  }, [rules])

  const { data, error } = useSWR(
    activeGame && allValid ? [`games/${activeGame.id}/player-groups/preview-count`, ruleMode, JSON.stringify(rules)] : null,
    fetcher
  )

  return {
    count: data?.count,
    loading: allValid && !data && !error,
    error: error && buildError(error)
  }
}
