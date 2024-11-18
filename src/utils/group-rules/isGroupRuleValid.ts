import { UnpackedGroupRule } from '../../modals/groups/GroupDetails'

export default function isGroupRuleValid(rawRule: UnpackedGroupRule) {
  if (Object.keys(rawRule.operands).length < rawRule.operandCount) return false
  if (Object.values(rawRule.operands).some((operand) => (operand ?? '').length === 0)) return false
  if (rawRule.namespaced && !rawRule.namespacedValue) return false
  return true
}
