import React from 'react'
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
  axiosMock.onGet('http://talo.test/games/1/player-groups/rules').reply(200, {
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
        defaultCastType: 'CHAR'
      },
      {
        field: 'lastSeenAt',
        defaultCastType: 'DATETIME'
      },
      {
        field: 'createdAt',
        defaultCastType: 'DATETIME'
      }
    ]
  })

  it('should render non-prop rules', async () => {
    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={['$and', jest.fn()]}
          rulesState={[
            [{
              name: 'GT',
              negate: false,
              castType: 'DATETIME',
              field: 'createdAt',
              propKey: '',
              operands: {
                0: '2022-03-03'
              },
              operandCount: 1
            }],
            jest.fn()
          ]}
        />
      </KitchenSink>
    )

    expect(await screen.findByText('createdAt')).toBeInTheDocument()
    expect(screen.getByText('is greater than')).toBeInTheDocument()
    expect(screen.getByDisplayValue('03 Mar 2022')).toBeInTheDocument()
  })

  it('should render prop rules', async () => {
    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={['$and', jest.fn()]}
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
              operandCount: 1
            }],
            jest.fn()
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
    const changeMock = jest.fn()

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={['$and', jest.fn()]}
          rulesState={[
            [],
            changeMock
          ]}
        />
      </KitchenSink>
    )

    userEvent.click(await screen.findByText('Add filter'))

    expect(getLatestChange(changeMock)([])).toStrictEqual([{
      name: 'EQUALS',
      negate: false,
      castType: 'CHAR',
      field: 'prop with key',
      operands: {},
      operandCount: 1
    }])
  })

  it('should delete rules', async () => {
    const changeMock = jest.fn()

    const rules = [
      {
        name: 'LT',
        negate: false,
        castType: 'DATETIME',
        field: 'createdAt',
        propKey: '',
        operands: {
          0: '2022-03-03'
        },
        operandCount: 1
      },
      {
        name: 'GT',
        negate: false,
        castType: 'DATETIME',
        field: 'createdAt',
        propKey: '',
        operands: {
          0: '2022-01-01'
        },
        operandCount: 1
      }
    ]

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={['$and', jest.fn()]}
          rulesState={[
            rules,
            changeMock
          ]}
        />
      </KitchenSink>
    )

    userEvent.click(await screen.findByLabelText('Delete rule 1'))

    expect(getLatestChange(changeMock)(rules)).toStrictEqual([rules[1]])
  })

  it('should update operands', async () => {
    const changeMock = jest.fn()

    const initialRule = {
      name: 'LT',
      negate: false,
      castType: 'DOUBLE',
      field: 'prop with key',
      propKey: 'pos.x',
      operands: {
        0: '5'
      },
      operandCount: 1
    }

    const irrelevantRule = {
      name: 'SET',
      negate: false,
      castType: 'CHAR',
      field: 'prop with key',
      propKey: 'hasWonGame',
      operands: {},
      operandCount: 0
    }

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={['$and', jest.fn()]}
          rulesState={[
            [initialRule, irrelevantRule],
            changeMock
          ]}
        />
      </KitchenSink>
    )

    userEvent.type(await screen.findByDisplayValue('5'), '6')

    expect(getLatestChange(changeMock)([initialRule, irrelevantRule])).toStrictEqual([{
      name: 'LT',
      negate: false,
      castType: 'DOUBLE',
      field: 'prop with key',
      propKey: 'pos.x',
      operands: {
        0: '56'
      },
      operandCount: 1
    }, irrelevantRule])
  })

  it('should update rule names', async () => {
    const changeMock = jest.fn()

    const initialRule = {
      name: 'LT',
      negate: false,
      castType: 'DOUBLE',
      field: 'prop with key',
      propKey: 'pos.x',
      operands: {
        0: '5'
      },
      operandCount: 1
    }

    const irrelevantRule = {
      name: 'SET',
      negate: false,
      castType: 'CHAR',
      field: 'prop with key',
      propKey: 'hasWonGame',
      operands: {},
      operandCount: 0
    }

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={['$and', jest.fn()]}
          rulesState={[
            [initialRule, irrelevantRule],
            changeMock
          ]}
        />
      </KitchenSink>
    )

    userEvent.click(await screen.findByText('is less than'))
    userEvent.click(await screen.findByText('is greater than'))

    expect(getLatestChange(changeMock)([initialRule, irrelevantRule])).toStrictEqual([{
      name: 'GT',
      negate: false,
      castType: 'DOUBLE',
      field: 'prop with key',
      propKey: 'pos.x',
      operands: {
        0: '5'
      },
      operandCount: 1
    }, irrelevantRule])
  })

  it('should update rule mode to $or', async () => {
    const changeMock = jest.fn()

    const rules = [
      {
        name: 'LT',
        negate: false,
        castType: 'DATETIME',
        field: 'createdAt',
        propKey: '',
        operands: {
          0: '2022-03-03'
        },
        operandCount: 1
      },
      {
        name: 'GT',
        negate: false,
        castType: 'DATETIME',
        field: 'createdAt',
        propKey: '',
        operands: {
          0: '2022-01-01'
        },
        operandCount: 1
      }
    ]

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={['$and', changeMock]}
          rulesState={[
            rules,
            jest.fn()
          ]}
        />
      </KitchenSink>
    )

    userEvent.click(await screen.findByText('and'))
    userEvent.click(await screen.findByText('or'))

    expect(changeMock).toHaveBeenCalledWith('$or')
  })

  it('should update rule mode to $and', async () => {
    const changeMock = jest.fn()

    const rules = [
      {
        name: 'LT',
        negate: false,
        castType: 'DATETIME',
        field: 'createdAt',
        propKey: '',
        operands: {
          0: '2022-03-03'
        },
        operandCount: 1
      },
      {
        name: 'GT',
        negate: false,
        castType: 'DATETIME',
        field: 'createdAt',
        propKey: '',
        operands: {
          0: '2022-01-01'
        },
        operandCount: 1
      }
    ]

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={['$or', changeMock]}
          rulesState={[
            rules,
            jest.fn()
          ]}
        />
      </KitchenSink>
    )

    userEvent.click(await screen.findByText('or'))
    userEvent.click(await screen.findByText('and'))

    expect(changeMock).toHaveBeenCalledWith('$and')
  })

  it('should update fields', async () => {
    const changeMock = jest.fn()

    const initialRule = {
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

    const irrelevantRule = {
      name: 'SET',
      negate: false,
      castType: 'CHAR',
      field: 'prop with key',
      propKey: 'hasWonGame',
      operands: {},
      operandCount: 0
    }

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={['$and', jest.fn()]}
          rulesState={[
            [initialRule, irrelevantRule],
            changeMock
          ]}
        />
      </KitchenSink>
    )

    userEvent.click(await screen.findByText('createdAt'))
    userEvent.click(await screen.findByText('lastSeenAt'))

    expect(getLatestChange(changeMock)([initialRule, irrelevantRule])).toStrictEqual([{
      name: 'EQUALS',
      negate: false,
      castType: 'DATETIME',
      field: 'lastSeenAt',
      propKey: '',
      operands: {
        0: ''
      },
      operandCount: 1
    }, irrelevantRule])
  })

  it('should update prop key names', async () => {
    const changeMock = jest.fn()

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
          ruleModeState={['$and', jest.fn()]}
          rulesState={[
            [initialRule, irrelevantRule],
            changeMock
          ]}
        />
      </KitchenSink>
    )

    userEvent.type(await screen.findByDisplayValue('hasLoggedIn'), '1')

    expect(getLatestChange(changeMock)([initialRule, irrelevantRule])).toStrictEqual([{
      name: 'SET',
      negate: false,
      castType: 'CHAR',
      field: 'prop with key',
      propKey: 'hasLoggedIn1',
      operands: {},
      operandCount: 0
    }, irrelevantRule])
  })

  it('should update the cast type', async () => {
    const changeMock = jest.fn()

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
          ruleModeState={['$and', jest.fn()]}
          rulesState={[
            [initialRule, irrelevantRule],
            changeMock
          ]}
        />
      </KitchenSink>
    )

    userEvent.click(await screen.findByText('text'))
    userEvent.click(await screen.findByText('number'))

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

  it('should render errors', async () => {
    axiosMock.reset()
    axiosMock.onGet('http://talo.test/games/1/player-groups/rules').networkErrorOnce()

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={['$and', jest.fn()]}
          rulesState={[[], jest.fn()]}
        />
      </KitchenSink>
    )

    expect(await screen.findByText('Network Error')).toBeInTheDocument()
  })
})
