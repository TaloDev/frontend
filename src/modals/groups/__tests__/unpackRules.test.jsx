import { unpackRules } from '../GroupDetails'

describe('unpackRules', () => {
  it('should unpack a non-prop rule', () => {
    expect(unpackRules([
      {
        name: 'GT',
        negate: false,
        castType: 'DATETIME',
        field: 'createdAt',
        operands: ['2022-03-03']
      }
    ])).toStrictEqual([
      {
        name: 'GT',
        negate: false,
        castType: 'DATETIME',
        field: 'createdAt',
        propKey: '',
        operands: {
          0: '2022-03-03'
        },
        operandCount: 1
      }
    ])
  })

  it('should unpack a prop rule', () => {
    expect(unpackRules([
      {
        name: 'GT',
        negate: true,
        castType: 'DOUBLE',
        field: 'props.currentLevel',
        operands: ['70']
      }
    ])).toStrictEqual([
      {
        name: 'GT',
        negate: true,
        castType: 'DOUBLE',
        field: 'prop with key',
        propKey: 'currentLevel',
        operands: {
          0: '70'
        },
        operandCount: 1
      }
    ])
  })
})
