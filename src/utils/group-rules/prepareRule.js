export default function prepareRule(rule) {
  return {
    name: rule.name,
    negate: rule.negate,
    castType: rule.castType,
    field: rule.propKey ? `props.${rule.propKey}` : rule.field,
    operands: Object.values(rule.operands).filter((_, idx) => idx < rule.operandCount)
  }
}
