import { PlayerGroupRuleCastType, PlayerGroupRuleName } from '../../../entities/playerGroup'
import prepareRule from '../prepareRule'

describe('prepareRule', () => {
  it('should produce a correct rule for a prop-key field', () => {
    expect(prepareRule({
      name: PlayerGroupRuleName.EQUALS,
      negate: true,
      castType: PlayerGroupRuleCastType.DOUBLE,
      operands: {
        0: '60'
      },
      operandCount: 1,
      namespaced: true,
      namespacedValue: 'level',
      mapsTo: 'props'
    })).toStrictEqual({
      name: PlayerGroupRuleName.EQUALS,
      negate: true,
      castType: PlayerGroupRuleCastType.DOUBLE,
      field: 'props.level',
      operands: ['60'],
      namespaced: true
    })
  })

  it('should produce a correct rule for a non-prop-key field', () => {
    expect(prepareRule({
      name: PlayerGroupRuleName.EQUALS,
      negate: true,
      castType: PlayerGroupRuleCastType.DOUBLE,
      operands: {
        0: '60'
      },
      operandCount: 1,
      mapsTo: 'lastSeenAt',
      namespaced: false,
      namespacedValue: ''
    })).toStrictEqual({
      name: PlayerGroupRuleName.EQUALS,
      negate: true,
      castType: PlayerGroupRuleCastType.DOUBLE,
      field: 'lastSeenAt',
      operands: ['60'],
      namespaced: false
    })
  })

  it('should filter out extraneous operands', () => {
    expect(prepareRule({
      name: PlayerGroupRuleName.EQUALS,
      negate: true,
      castType: PlayerGroupRuleCastType.DOUBLE,
      operands: {
        0: '60',
        1: '70',
        2: '80'
      },
      operandCount: 1,
      mapsTo: 'lastSeenAt',
      namespaced: false,
      namespacedValue: ''
    })).toStrictEqual({
      name: PlayerGroupRuleName.EQUALS,
      negate: true,
      castType: PlayerGroupRuleCastType.DOUBLE,
      field: 'lastSeenAt',
      operands: ['60'],
      namespaced: false
    })
  })
})
