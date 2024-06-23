import { PlayerGroupRule } from '../../entities/playerGroup'
import { UnpackedGroupRule } from '../../modals/groups/GroupDetails'

export default function prepareRule(rule: UnpackedGroupRule): PlayerGroupRule {
  return {
    name: rule.name,
    negate: rule.negate,
    castType: rule.castType,
    field: rule.propKey ? `${rule.mapsTo}.${rule.propKey}` : rule.mapsTo,
    operands: Object.values(rule.operands).filter((_, idx) => idx < rule.operandCount)
  }
}
