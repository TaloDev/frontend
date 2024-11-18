import { PlayerGroupRule } from '../../entities/playerGroup'
import { UnpackedGroupRule } from '../../modals/groups/GroupDetails'

export function unpackRules(rules?: PlayerGroupRule[]): UnpackedGroupRule[] | undefined {
  if (!rules) return rules

  return rules.map((rule) => {
    const field = rule.field.split('.')[0]
    const namespacedValue = rule.namespaced
      ? rule.field.split('.').slice(1).join('.')
      : ''

    return {
      name: rule.name,
      negate: rule.negate,
      castType: rule.castType,
      mapsTo: field,
      namespaced: rule.namespaced,
      namespacedValue,
      operands: rule.operands.reduce((acc, curr, idx) => ({
        ...acc,
        [idx]: curr
      }), {}),
      operandCount: rule.operands.length
    }
  })
}
