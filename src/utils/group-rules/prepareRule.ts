import { PlayerGroupRule } from '../../entities/playerGroup'
import { UnpackedGroupRule } from '../../modals/groups/GroupDetails'

export default function prepareRule(rule: UnpackedGroupRule): PlayerGroupRule {
  return {
    name: rule.name,
    negate: rule.negate,
    castType: rule.castType,
    field: rule.namespaced ? `${rule.mapsTo}.${rule.namespacedValue}` : rule.mapsTo,
    operands: Object.values(rule.operands).filter((_, idx) => idx < rule.operandCount),
    namespaced: rule.namespaced
  }
}
