import isGroupRuleValid from '../isGroupRuleValid'

describe('isGroupRuleValid', () => {
  it('should mark a rule with less operands than the required count as invalid', () => {
    expect(isGroupRuleValid({
      operands: {
        0: '75'
      },
      operandCount: 2
    })).toBe(false)
  })

  it('should mark a rule with a prop field but a missing key as invalid', () => {
    expect(isGroupRuleValid({
      field: 'prop with key',
      operands: {
        0: '75',
        1: '30'
      },
      operandCount: 2
    })).toBe(false)
  })

  it('should mark a rule with a prop field and key as valid', () => {
    expect(isGroupRuleValid({
      field: 'prop with key',
      operands: {
        0: '75',
        1: '30'
      },
      operandCount: 2,
      propKey: 'zonesVisited'
    })).toBe(true)
  })
})
