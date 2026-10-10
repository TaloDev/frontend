import { normaliseContent } from '../nodeGraphHelpers'

describe('normaliseContent', () => {
  it('should decode a Godot var_to_str dictionary value', () => {
    const content = { value: '{\n"level": 3\n}' }

    expect(normaliseContent(content)).toStrictEqual({ value: { level: 3 } })
  })

  it('should strip a Godot type prefix from an array', () => {
    const content = { value: 'Array[String](["a", "b"])' }

    expect(normaliseContent(content)).toStrictEqual({ value: ['a', 'b'] })
  })

  it('should strip a typed dictionary with nested type args', () => {
    const content = { value: 'Dictionary[String, Dictionary]({"k": {"n": 1}})' }

    expect(normaliseContent(content)).toStrictEqual({ value: { k: { n: 1 } } })
  })

  it('should leave plain strings alone', () => {
    const content = { value: 'just a name' }

    expect(normaliseContent(content)).toStrictEqual({ value: 'just a name' })
  })

  it('should scan nested type args instead of matching a closing bracket', () => {
    const content = { value: 'Array[String](["a)b"])' }

    expect(normaliseContent(content)).toStrictEqual({ value: ['a)b'] })
  })

  it('should decode a double-encoded payload', () => {
    const content = { value: '"{\\"a\\": 1}"' }

    expect(normaliseContent(content)).toStrictEqual({ value: { a: 1 } })
  })

  it('should keep malformed values without throwing', () => {
    const content = { value: 'Array[String]([broken' }

    expect(() => normaliseContent(content)).not.toThrow()
    expect(normaliseContent(content)).toStrictEqual({ value: 'Array[String]([broken' })
  })

  it('should not mutate the input content', () => {
    const content = { value: '{"a": 1}', nested: { list: ['[1, 2]'] } }
    const snapshot = JSON.parse(JSON.stringify(content))

    normaliseContent(content)

    expect(content).toStrictEqual(snapshot)
  })
})
