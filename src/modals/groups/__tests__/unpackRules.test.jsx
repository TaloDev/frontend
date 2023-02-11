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
        operandCount: 1,
        mapsTo: 'createdAt'
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
        operandCount: 1,
        mapsTo: 'props'
      }
    ])
  })

  it('should unpack a meta prop rule', () => {
    expect(unpackRules([
      {
        name: 'EQUALS',
        negate: true,
        castType: 'CHAR',
        field: 'props.META_OS',
        operands: ['macOS']
      }
    ])).toStrictEqual([
      {
        name: 'EQUALS',
        negate: true,
        castType: 'CHAR',
        field: 'operating system',
        propKey: '',
        operands: {
          0: 'macOS'
        },
        operandCount: 1,
        mapsTo: 'props.META_OS'
      }
    ])
  })
})
