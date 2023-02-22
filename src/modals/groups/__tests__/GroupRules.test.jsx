import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import api from '../../../api/api'
import MockAdapter from 'axios-mock-adapter'
import activeGameState from '../../../state/activeGameState'
import KitchenSink from '../../../utils/KitchenSink'
import GroupRules from '../GroupRules'

function getLatestChange(changeMock) {
  return changeMock.mock.calls[changeMock.mock.calls.length - 1][0]
}

describe('<GroupRules />', () => {
  const axiosMock = new MockAdapter(api)
  const activeGameValue = { id: 1, name: 'Shattered' }
  axiosMock.onGet('http://talo.api/games/1/player-groups/rules').reply(200, {
    'availableRules': [
      {
        name: 'EQUALS',
        castTypes: [
          'CHAR',
          'DOUBLE',
          'DATETIME'
        ],
        operandCount: 1,
        negate: false
      },
      {
        name: 'EQUALS',
        castTypes: [
          'CHAR',
          'DOUBLE',
          'DATETIME'
        ],
        operandCount: 1,
        negate: true
      },
      {
        name: 'GT',
        negatable: false,
        castTypes: [
          'DOUBLE',
          'DATETIME'
        ],
        operandCount: 1,
        negate: false
      },
      {
        name: 'GTE',
        negatable: false,
        castTypes: [
          'DOUBLE',
          'DATETIME'
        ],
        operandCount: 1,
        negate: false
      },
      {
        name: 'LT',
        negatable: false,
        castTypes: [
          'DOUBLE',
          'DATETIME'
        ],
        operandCount: 1,
        negate: false
      },
      {
        name: 'LTE',
        negatable: false,
        castTypes: [
          'DOUBLE',
          'DATETIME'
        ],
        operandCount: 1,
        negate: false
      },
      {
        name: 'SET',
        castTypes: [
          'CHAR',
          'DOUBLE',
          'DATETIME'
        ],
        operandCount: 0,
        negate: false
      },
      {
        name: 'SET',
        castTypes: [
          'CHAR',
          'DOUBLE',
          'DATETIME'
        ],
        operandCount: 0,
        negate: true
      }
    ],
    availableFields: [
      {
        field: 'prop with key',
        defaultCastType: 'CHAR',
        mapsTo: 'props'
      },
      {
        field: 'latest login',
        defaultCastType: 'DATETIME',
        mapsTo: 'lastSeenAt'
      },
      {
        field: 'first login',
        defaultCastType: 'DATETIME',
        mapsTo: 'createdAt'
      }
    ]
  })

  it('should render non-prop rules', async () => {
    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={['$and', vi.fn()]}
          rulesState={[
            [{
              name: 'GT',
              negate: false,
              castType: 'DATETIME',
              field: 'first login',
              propKey: '',
              operands: {
                0: '2022-03-03'
              },
              operandCount: 1,
              mapsTo: 'createdAt'
            }],
            vi.fn()
          ]}
        />
      </KitchenSink>
    )

    expect(await screen.findByText('first login')).toBeInTheDocument()
    expect(screen.getByText('is greater than')).toBeInTheDocument()
    expect(screen.getByDisplayValue('03 Mar 2022')).toBeInTheDocument()
  })

  it('should render prop rules', async () => {
    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={['$and', vi.fn()]}
          rulesState={[
            [{
              name: 'LTE',
              negate: true,
              castType: 'DOUBLE',
              field: 'prop with key',
              propKey: 'currentLevel',
              operands: {
                0: '55'
              },
              operandCount: 1,
              mapsTo: 'props'
            }],
            vi.fn()
          ]}
        />
      </KitchenSink>
    )

    expect(await screen.findByDisplayValue('currentLevel')).toBeInTheDocument()
    expect(screen.getByText('number')).toBeInTheDocument()
    expect(screen.getByText('is not less than or equal to')).toBeInTheDocument()
    expect(screen.getByDisplayValue('55')).toBeInTheDocument()
  })

  it('should add rules', async () => {
    const changeMock = vi.fn()

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={['$and', vi.fn()]}
          rulesState={[
            [],
            changeMock
          ]}
        />
      </KitchenSink>
    )

    await userEvent.click(await screen.findByText('Add filter'))

    expect(getLatestChange(changeMock)([])).toStrictEqual([{
      name: 'EQUALS',
      negate: false,
      castType: 'CHAR',
      field: 'prop with key',
      operands: {},
      operandCount: 1,
      mapsTo: 'props'
    }])
  })

  it('should delete rules', async () => {
    const changeMock = vi.fn()

    const rules = [
      {
        name: 'LT',
        negate: false,
        castType: 'DATETIME',
        field: 'first login',
        propKey: '',
        operands: {
          0: '2022-03-03'
        },
        operandCount: 1,
        mapsTo: 'createdAt'
      },
      {
        name: 'GT',
        negate: false,
        castType: 'DATETIME',
        field: 'first login',
        propKey: '',
        operands: {
          0: '2022-01-01'
        },
        operandCount: 1,
        mapsTo: 'createdAt'
      }
    ]

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={['$and', vi.fn()]}
          rulesState={[
            rules,
            changeMock
          ]}
        />
      </KitchenSink>
    )

    await userEvent.click(await screen.findByLabelText('Delete rule 1'))

    expect(getLatestChange(changeMock)(rules)).toStrictEqual([rules[1]])
  })

  it('should update operands', async () => {
    const changeMock = vi.fn()

    const initialRule = {
      name: 'LT',
      negate: false,
      castType: 'DOUBLE',
      field: 'prop with key',
      propKey: 'pos.x',
      operands: {
        0: '5'
      },
      operandCount: 1,
      mapsTo: 'props'
    }

    const irrelevantRule = {
      name: 'SET',
      negate: false,
      castType: 'CHAR',
      field: 'prop with key',
      propKey: 'hasWonGame',
      operands: {},
      operandCount: 0,
      mapsTo: 'props'
    }

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={['$and', vi.fn()]}
          rulesState={[
            [initialRule, irrelevantRule],
            changeMock
          ]}
        />
      </KitchenSink>
    )

    await userEvent.type(await screen.findByDisplayValue('5'), '6')

    expect(getLatestChange(changeMock)([initialRule, irrelevantRule])).toStrictEqual([{
      name: 'LT',
      negate: false,
      castType: 'DOUBLE',
      field: 'prop with key',
      propKey: 'pos.x',
      operands: {
        0: '56'
      },
      operandCount: 1,
      mapsTo: 'props'
    }, irrelevantRule])
  })

  it('should update rule names', async () => {
    const changeMock = vi.fn()

    const initialRule = {
      name: 'LT',
      negate: false,
      castType: 'DOUBLE',
      field: 'prop with key',
      propKey: 'pos.x',
      operands: {
        0: '5'
      },
      operandCount: 1,
      mapsTo: 'props'
    }

    const irrelevantRule = {
      name: 'SET',
      negate: false,
      castType: 'CHAR',
      field: 'prop with key',
      propKey: 'hasWonGame',
      operands: {},
      operandCount: 0,
      mapsTo: 'props'
    }

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={['$and', vi.fn()]}
          rulesState={[
            [initialRule, irrelevantRule],
            changeMock
          ]}
        />
      </KitchenSink>
    )

    await userEvent.click(await screen.findByText('is less than'))
    await userEvent.click(await screen.findByText('is greater than'))

    expect(getLatestChange(changeMock)([initialRule, irrelevantRule])).toStrictEqual([{
      name: 'GT',
      negate: false,
      castType: 'DOUBLE',
      field: 'prop with key',
      propKey: 'pos.x',
      operands: {
        0: '5'
      },
      operandCount: 1,
      mapsTo: 'props'
    }, irrelevantRule])
  })

  it('should update rule mode to $or', async () => {
    const changeMock = vi.fn()

    const rules = [
      {
        name: 'LT',
        negate: false,
        castType: 'DATETIME',
        field: 'first login',
        propKey: '',
        operands: {
          0: '2022-03-03'
        },
        operandCount: 1,
        mapsTo: 'createdAt'
      },
      {
        name: 'GT',
        negate: false,
        castType: 'DATETIME',
        field: 'first login',
        propKey: '',
        operands: {
          0: '2022-01-01'
        },
        operandCount: 1,
        mapsTo: 'createdAt'
      }
    ]

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={['$and', changeMock]}
          rulesState={[
            rules,
            vi.fn()
          ]}
        />
      </KitchenSink>
    )

    await userEvent.click(await screen.findByText('and'))
    await userEvent.click(await screen.findByText('or'))

    expect(changeMock).toHaveBeenCalledWith('$or')
  })

  it('should update rule mode to $and', async () => {
    const changeMock = vi.fn()

    const rules = [
      {
        name: 'LT',
        negate: false,
        castType: 'DATETIME',
        field: 'first login',
        propKey: '',
        operands: {
          0: '2022-03-03'
        },
        operandCount: 1,
        mapsTo: 'createdAt'
      },
      {
        name: 'GT',
        negate: false,
        castType: 'DATETIME',
        field: 'first login',
        propKey: '',
        operands: {
          0: '2022-01-01'
        },
        operandCount: 1,
        mapsTo: 'createdAt'
      }
    ]

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={['$or', changeMock]}
          rulesState={[
            rules,
            vi.fn()
          ]}
        />
      </KitchenSink>
    )

    await userEvent.click(await screen.findByText('or'))
    await userEvent.click(await screen.findByText('and'))

    expect(changeMock).toHaveBeenCalledWith('$and')
  })

  it('should update fields', async () => {
    const changeMock = vi.fn()

    const initialRule = {
      name: 'LT',
      negate: false,
      castType: 'DATETIME',
      field: 'first login',
      propKey: '',
      operands: {
        0: '5'
      },
      operandCount: 1,
      mapsTo: 'createdAt'
    }

    const irrelevantRule = {
      name: 'SET',
      negate: false,
      castType: 'CHAR',
      field: 'prop with key',
      propKey: 'hasWonGame',
      operands: {},
      operandCount: 0,
      mapsTo: 'props'
    }

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={['$and', vi.fn()]}
          rulesState={[
            [initialRule, irrelevantRule],
            changeMock
          ]}
        />
      </KitchenSink>
    )

    await userEvent.click(await screen.findByText('first login'))
    await userEvent.click(await screen.findByText('latest login'))

    expect(getLatestChange(changeMock)([initialRule, irrelevantRule])).toStrictEqual([{
      name: 'EQUALS',
      negate: false,
      castType: 'DATETIME',
      field: 'latest login',
      propKey: '',
      operands: {
        0: ''
      },
      operandCount: 1,
      mapsTo: 'lastSeenAt'
    }, irrelevantRule])
  })

  it('should update prop key names', async () => {
    const changeMock = vi.fn()

    const initialRule = {
      name: 'SET',
      negate: false,
      castType: 'CHAR',
      field: 'prop with key',
      propKey: 'hasLoggedIn',
      operands: {},
      operandCount: 0,
      mapsTo: 'props'
    }

    const irrelevantRule = {
      name: 'LT',
      negate: false,
      castType: 'DATETIME',
      field: 'first login',
      propKey: '',
      operands: {
        0: '5'
      },
      operandCount: 1,
      mapsTo: 'createdAt'
    }

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={['$and', vi.fn()]}
          rulesState={[
            [initialRule, irrelevantRule],
            changeMock
          ]}
        />
      </KitchenSink>
    )

    await userEvent.type(await screen.findByDisplayValue('hasLoggedIn'), '1')

    expect(getLatestChange(changeMock)([initialRule, irrelevantRule])).toStrictEqual([{
      name: 'SET',
      negate: false,
      castType: 'CHAR',
      field: 'prop with key',
      propKey: 'hasLoggedIn1',
      operands: {},
      operandCount: 0,
      mapsTo: 'props'
    }, irrelevantRule])
  })

  it('should update the cast type', async () => {
    const changeMock = vi.fn()

    const initialRule = {
      name: 'SET',
      negate: false,
      castType: 'CHAR',
      field: 'prop with key',
      propKey: 'hasLoggedIn',
      operands: {},
      operandCount: 0
    }

    const irrelevantRule = {
      name: 'LT',
      negate: false,
      castType: 'DATETIME',
      field: 'createdAt',
      propKey: '',
      operands: {
        0: '5'
      },
      operandCount: 1
    }

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={['$and', vi.fn()]}
          rulesState={[
            [initialRule, irrelevantRule],
            changeMock
          ]}
        />
      </KitchenSink>
    )

    await userEvent.click(await screen.findByText('text'))
    await userEvent.click(await screen.findByText('number'))

    expect(getLatestChange(changeMock)([initialRule, irrelevantRule])).toStrictEqual([{
      name: 'SET',
      negate: false,
      castType: 'DOUBLE',
      field: 'prop with key',
      propKey: 'hasLoggedIn',
      operands: {},
      operandCount: 0
    }, irrelevantRule])
  })

  it('should select meta props', async () => {
    const changeMock = vi.fn()

    const initialRule = {
      name: 'LT',
      negate: false,
      castType: 'DATETIME',
      field: 'first login',
      propKey: '',
      operands: {
        0: '5'
      },
      operandCount: 1,
      mapsTo: 'createdAt'
    }

    const irrelevantRule = {
      name: 'SET',
      negate: false,
      castType: 'CHAR',
      field: 'prop with key',
      propKey: 'hasWonGame',
      operands: {},
      operandCount: 0,
      mapsTo: 'props'
    }

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={['$and', vi.fn()]}
          rulesState={[
            [initialRule, irrelevantRule],
            changeMock
          ]}
        />
      </KitchenSink>
    )

    await userEvent.click(await screen.findByText('first login'))
    await userEvent.click(await screen.findByText('window mode'))

    expect(getLatestChange(changeMock)([initialRule, irrelevantRule])).toStrictEqual([{
      name: 'EQUALS',
      negate: false,
      castType: 'DOUBLE',
      field: 'window mode',
      propKey: 'META_WINDOW_MODE',
      operands: {
        0: ''
      },
      operandCount: 1,
      mapsTo: 'props'
    }, irrelevantRule])
  })

  it('should remove operands for a rule with no operands', async () => {
    const changeMock = vi.fn()

    const initialRule = {
      name: 'LT',
      negate: false,
      castType: 'DOUBLE',
      field: 'prop with key',
      propKey: 'pos.x',
      operands: {
        0: '5'
      },
      operandCount: 1,
      mapsTo: 'props'
    }

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={['$and', vi.fn()]}
          rulesState={[
            [initialRule],
            changeMock
          ]}
        />
      </KitchenSink>
    )

    await userEvent.click(await screen.findByText('is less than'))
    await userEvent.click(await screen.findByText('is set'))

    expect(getLatestChange(changeMock)([initialRule])).toStrictEqual([{
      name: 'SET',
      negate: false,
      castType: 'DOUBLE',
      field: 'prop with key',
      propKey: 'pos.x',
      operands: {},
      operandCount: 0,
      mapsTo: 'props'
    }])
  })

  it('should render errors', async () => {
    axiosMock.reset()
    axiosMock.onGet('http://talo.api/games/1/player-groups/rules').networkErrorOnce()

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={['$and', vi.fn()]}
          rulesState={[[], vi.fn()]}
        />
      </KitchenSink>
    )

    expect(await screen.findByText('Network Error')).toBeInTheDocument()
  })
})
