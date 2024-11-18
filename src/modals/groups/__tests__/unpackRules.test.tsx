import { PlayerGroupRuleCastType, PlayerGroupRuleName } from '../../../entities/playerGroup'
import { unpackRules } from '../../../utils/group-rules/unpackRules'

describe('unpackRules', () => {
  it('should unpack a non-prop rule', () => {
    expect(unpackRules([
      {
        name: PlayerGroupRuleName.GT,
        negate: false,
        castType: PlayerGroupRuleCastType.DATETIME,
        field: 'createdAt',
        operands: ['2022-03-03'],
        namespaced: false
      }
    ])).toStrictEqual([
      {
        name: 'GT',
        negate: false,
        castType: 'DATETIME',
        namespaced: false,
        namespacedValue: '',
        operands: {
          0: '2022-03-03'
        },
        operandCount: 1,
        mapsTo: 'createdAt'
      }
    ])
  })

  it('should unpack a prop rule', () => {
    expect(unpackRules([
      {
        name: PlayerGroupRuleName.GT,
        negate: true,
        castType: PlayerGroupRuleCastType.DOUBLE,
        field: 'props.currentLevel',
        operands: ['70'],
        namespaced: true
      }
    ])).toStrictEqual([
      {
        name: 'GT',
        negate: true,
        castType: 'DOUBLE',
        namespaced: true,
        namespacedValue: 'currentLevel',
        operands: {
          0: '70'
        },
        operandCount: 1,
        mapsTo: 'props'
      }
    ])
  })

  it('should unpack a meta prop rule', () => {
    expect(unpackRules([
      {
        name: PlayerGroupRuleName.EQUALS,
        negate: true,
        castType: PlayerGroupRuleCastType.CHAR,
        field: 'props.META_OS',
        operands: ['macOS'],
        namespaced: true
      }
    ])).toStrictEqual([
      {
        name: 'EQUALS',
        negate: true,
        castType: 'CHAR',
        namespaced: true,
        namespacedValue: 'META_OS',
        operands: {
          0: 'macOS'
        },
        operandCount: 1,
        mapsTo: 'props'
      }
    ])
  })
})
