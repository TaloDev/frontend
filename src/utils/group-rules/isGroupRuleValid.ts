import { UnpackedGroupRule } from '../../modals/groups/GroupDetails'
import { groupPropKeyField } from '../../modals/groups/GroupRules'

export default function isGroupRuleValid(rawRule: UnpackedGroupRule) {
  if (Object.keys(rawRule.operands).length < rawRule.operandCount) return false
  if (Object.values(rawRule.operands).some((operand) => (operand ?? '').length === 0)) return false
  if (rawRule.field === groupPropKeyField && !rawRule.propKey) return false
  return true
}
