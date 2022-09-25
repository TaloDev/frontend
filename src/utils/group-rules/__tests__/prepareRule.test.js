import prepareRule from '../prepareRule'

describe('prepareRule', () => {
  it('should produce a correct rule for a prop-key field', () => {
    expect(prepareRule({
      name: 'EQUALS',
      negate: true,
      castType: 'DOUBLE',
      operands: {
        0: '60'
      },
      operandCount: 1,
      field: 'prop with key',
      propKey: 'level'
    })).toStrictEqual({
      name: 'EQUALS',
      negate: true,
      castType: 'DOUBLE',
      field: 'props.level',
      operands: ['60']
    })
  })

  it('should produce a correct rule for a non-prop-key field', () => {
    expect(prepareRule({
      name: 'EQUALS',
      negate: true,
      castType: 'DOUBLE',
      operands: {
        0: '60'
      },
      operandCount: 1,
      field: 'lastSeenAt'
    })).toStrictEqual({
      name: 'EQUALS',
      negate: true,
      castType: 'DOUBLE',
      field: 'lastSeenAt',
      operands: ['60']
    })
  })

  it('should filter out extraneous operands', () => {
    expect(prepareRule({
      name: 'EQUALS',
      negate: true,
      castType: 'DOUBLE',
      operands: {
        0: '60',
        1: '70',
        2: '80'
      },
      operandCount: 1,
      field: 'lastSeenAt'
    })).toStrictEqual({
      name: 'EQUALS',
      negate: true,
      castType: 'DOUBLE',
      field: 'lastSeenAt',
      operands: ['60']
    })
  })
})
