export default function isGroupRuleValid(rawRule) {
  if (Object.keys(rawRule.operands).length < rawRule.operandCount) return false
  if (Object.values(rawRule.operands).some((operand) => (operand ?? '').length === 0)) return false
  if (rawRule.field === 'prop with key' && !rawRule.propKey) return false
  return true
}
