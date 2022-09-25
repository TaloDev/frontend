import useSWR from 'swr'
import buildError from '../utils/buildError'
import api from './api'
import { stringify } from 'querystring'
import prepareRule from '../utils/group-rules/prepareRule'
import isGroupRuleValid from '../utils/group-rules/isGroupRuleValid'
import { useMemo } from 'react'

const useGroupPreviewCount = (activeGame, ruleMode, rules) => {
  const fetcher = async (url) => {
    const qs = stringify({
      ruleMode,
      rules: JSON.stringify(rules.map(prepareRule))
    })

    const res = await api.get(`${url}?${qs}`)
    return res.data
  }

  const allValid = useMemo(() => {
    return rules.every(isGroupRuleValid)
  }, [rules])

  const { data, error } = useSWR(
    activeGame && allValid ? [`games/${activeGame.id}/player-groups/preview-count`, ruleMode, JSON.stringify(rules)] : null,
    fetcher
  )

  return {
    count: data?.count ?? 0,
    loading: allValid && !data && !error,
    error: error && buildError(error)
  }
}

export default useGroupPreviewCount
