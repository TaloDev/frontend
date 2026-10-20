import { JSON_ROW_TYPE, objectToRows, parseJsonDocument, typeOfRow } from '../nodeGraphHelpers'

describe('parseJsonDocument', () => {
  it('should decode an object or array string', () => {
    expect(parseJsonDocument('{"wallet": 2714}')).toStrictEqual({ wallet: 2714 })
    expect(parseJsonDocument('["bloo","zip","bubba"]')).toStrictEqual(['bloo', 'zip', 'bubba'])
  })

  it('should decode a double encoded document all the way', () => {
    expect(parseJsonDocument('"{\\"ad_daily_streak\\":{\\"days\\":1}}"')).toStrictEqual({
      ad_daily_streak: { days: 1 },
    })
  })

  it('should decode godot typed containers', () => {
    expect(parseJsonDocument('Array[String](["a", "b"])')).toStrictEqual(['a', 'b'])
    expect(parseJsonDocument('Dictionary[String, int]({"a": 1})')).toStrictEqual({ a: 1 })
    // markers nest inside payloads and inside documents
    expect(parseJsonDocument('Array[Array[String]]([Array[String](["a"])])')).toStrictEqual([['a']])
    expect(parseJsonDocument('[{"tools": Array[String](["uv"]), "n": 1}]')).toStrictEqual([
      { tools: ['uv'], n: 1 },
    ])
    // brackets and parens inside strings are not structure
    expect(parseJsonDocument('Array[String](["a)b"])')).toStrictEqual(['a)b'])
    // nor is a quote after an escaped backslash, as in a windows path
    expect(parseJsonDocument('Array[String](["C:\\\\"])')).toStrictEqual(['C:\\'])
    expect(parseJsonDocument('Array[String](["C:\\\\", "ok"])')).toStrictEqual(['C:\\', 'ok'])
  })

  it('should return null for values that are not documents', () => {
    // godot writes plain values as bare text, they must keep their exact spelling
    for (const value of [
      '2714',
      '1.50',
      'true',
      'null',
      '"guest_52999483"',
      '""',
      '"zip"',
      'just a name',
      'mytools[0]',
      'Array[String]',
      '',
    ]) {
      expect(parseJsonDocument(value)).toBeNull()
    }
  })

  it('should return null for a broken document without throwing', () => {
    expect(parseJsonDocument('{"wallet": ')).toBeNull()
    expect(parseJsonDocument('[broken')).toBeNull()
    expect(parseJsonDocument('"{\\"wallet\\": "')).toBeNull()
  })
})

describe('typeOfRow', () => {
  it('should mark json documents and keep every other type', () => {
    expect(typeOfRow('{"a": 1}')).toBe(JSON_ROW_TYPE)
    expect(typeOfRow('zip')).toBe('string')
    expect(typeOfRow(['a'])).toBe('object')
    expect(typeOfRow(4)).toBe('number')
    expect(typeOfRow(null)).toBe('object')
  })
})

describe('objectToRows', () => {
  it('should keep a json value in its row and mark it', () => {
    expect(objectToRows({ value: '{"a": 1}', type: '4' })).toStrictEqual([
      { item: 'value: {"a": 1}', type: JSON_ROW_TYPE },
      { item: 'type: 4', type: 'string' },
    ])
  })

  it('should still drop nested objects and arrays', () => {
    expect(objectToRows({ nested: { a: 1 }, list: [1, 2], keep: 'yes' })).toStrictEqual([
      { item: 'keep: yes', type: 'string' },
    ])
  })
})
