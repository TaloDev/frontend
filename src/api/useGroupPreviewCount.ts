import { useMemo } from 'react'
import useSWR from 'swr'
import { z } from 'zod'
import { Game } from '../entities/game'
import { PlayerGroupRuleMode } from '../entities/playerGroup'
import { UnpackedGroupRule } from '../modals/groups/GroupDetails'
import buildError from '../utils/buildError'
import isGroupRuleValid from '../utils/group-rules/isGroupRuleValid'
import prepareRule from '../utils/group-rules/prepareRule'
import makeValidatedGetRequest from './makeValidatedGetRequest'

export default function useGroupPreviewCount(
  activeGame: Game,
  ruleMode: PlayerGroupRuleMode,
  rules: UnpackedGroupRule[],
) {
  const fetcher = async ([url]: [string]) => {
    const qs = new URLSearchParams({
      ruleMode,
      rules: JSON.stringify(rules.map(prepareRule)),
    }).toString()

    const res = await makeValidatedGetRequest(
      `${url}?${qs}`,
      z.object({
        count: z.number(),
      }),
    )

    return res
  }

  const allValid = useMemo(() => {
    return rules.every(isGroupRuleValid)
  }, [rules])

  const { data, error } = useSWR(
    activeGame && allValid
      ? [`games/${activeGame.id}/player-groups/preview-count`, ruleMode, JSON.stringify(rules)]
      : null,
    fetcher,
  )

  return {
    count: data?.count,
    loading: allValid && !data && !error,
    error: error && buildError(error),
  }
}
