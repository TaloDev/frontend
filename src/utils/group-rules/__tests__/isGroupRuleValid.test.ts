import { PlayerGroupRuleCastType, PlayerGroupRuleName } from '../../../entities/playerGroup'
import isGroupRuleValid from '../isGroupRuleValid'

describe('isGroupRuleValid', () => {
  it('should mark a rule with less operands than the required count as invalid', () => {
    expect(isGroupRuleValid({
      name: PlayerGroupRuleName.EQUALS,
      operands: {
        0: '75'
      },
      operandCount: 2,
      negate: false,
      castType: PlayerGroupRuleCastType.DOUBLE,
      namespaced: true,
      namespacedValue: '',
      mapsTo: 'props'
    })).toBe(false)
  })

  it('should mark a rule with a prop field but a missing key as invalid', () => {
    expect(isGroupRuleValid({
      name: PlayerGroupRuleName.EQUALS,
      operands: {
        0: '75'
      },
      operandCount: 1,
      negate: false,
      castType: PlayerGroupRuleCastType.DOUBLE,
      namespaced: true,
      namespacedValue: '',
      mapsTo: 'props'
    })).toBe(false)
  })

  it('should mark a rule with a prop field and key as valid', () => {
    expect(isGroupRuleValid({
      name: PlayerGroupRuleName.EQUALS,
      operands: {
        0: '75',
        1: '30'
      },
      operandCount: 2,
      negate: false,
      castType: PlayerGroupRuleCastType.DOUBLE,
      namespaced: true,
      namespacedValue: 'zonesVisited',
      mapsTo: 'props'
    })).toBe(true)
  })

  it('should mark a rule with empty operands as invalid', () => {
    expect(isGroupRuleValid({
      name: PlayerGroupRuleName.EQUALS,
      operands: {
        0: ''
      },
      operandCount: 1,
      negate: false,
      castType: PlayerGroupRuleCastType.DOUBLE,
      namespaced: true,
      namespacedValue: 'zonesVisited',
      mapsTo: 'props'
    })).toBe(false)
  })
})
