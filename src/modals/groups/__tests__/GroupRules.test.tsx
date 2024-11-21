import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import api from '../../../api/api'
import MockAdapter from 'axios-mock-adapter'
import activeGameState from '../../../state/activeGameState'
import KitchenSink from '../../../utils/KitchenSink'
import GroupRules from '../GroupRules'
import { PlayerGroupRuleCastType, PlayerGroupRuleMode, PlayerGroupRuleName } from '../../../entities/playerGroup'
import { Mock } from 'vitest'
import { UnpackedGroupRule } from '../GroupDetails'

function getLatestChange(changeMock: Mock) {
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
        fieldDisplayName: 'prop with key',
        defaultCastType: 'CHAR',
        mapsTo: 'props',
        namespaced: true
      },
      {
        fieldDisplayName: 'latest login',
        defaultCastType: 'DATETIME',
        mapsTo: 'lastSeenAt',
        namespaced: false
      },
      {
        fieldDisplayName: 'first login',
        defaultCastType: 'DATETIME',
        mapsTo: 'createdAt',
        namespaced: false
      },
      {
        fieldDisplayName: 'value for stat',
        defaultCastType: 'DOUBLE',
        mapsTo: 'statValue',
        namespaced: true
      },
      {
        fieldDisplayName: 'score in leaderboard',
        defaultCastType: 'DOUBLE',
        mapsTo: 'leaderboardEntryScore',
        namespaced: true
      }
    ]
  })

  it('should render non-prop rules', async () => {
    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={[PlayerGroupRuleMode.AND, vi.fn()]}
          rulesState={[
            [{
              name: PlayerGroupRuleName.GT,
              negate: false,
              castType: PlayerGroupRuleCastType.DATETIME,
              namespaced: false,
              namespacedValue: '',
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
          ruleModeState={[PlayerGroupRuleMode.AND, vi.fn()]}
          rulesState={[
            [{
              name: PlayerGroupRuleName.LTE,
              negate: true,
              castType: PlayerGroupRuleCastType.DOUBLE,
              namespaced: true,
              namespacedValue: 'currentLevel',
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
          ruleModeState={[PlayerGroupRuleMode.AND, vi.fn()]}
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
      operands: {},
      operandCount: 1,
      mapsTo: 'props',
      namespaced: true,
      namespacedValue: ''
    }])
  })

  it('should delete rules', async () => {
    const changeMock = vi.fn()

    const rules: UnpackedGroupRule[] = [
      {
        name: PlayerGroupRuleName.LT,
        negate: false,
        castType: PlayerGroupRuleCastType.DATETIME,
        namespaced: true,
        namespacedValue: '',
        operands: {
          0: '2022-03-03'
        },
        operandCount: 1,
        mapsTo: 'createdAt'
      },
      {
        name: PlayerGroupRuleName.GT,
        negate: false,
        castType: PlayerGroupRuleCastType.DATETIME,
        namespaced: true,
        namespacedValue: '',
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
          ruleModeState={[PlayerGroupRuleMode.AND, vi.fn()]}
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

    const initialRule: UnpackedGroupRule = {
      name: PlayerGroupRuleName.GT,
      negate: false,
      castType: PlayerGroupRuleCastType.DOUBLE,
      namespaced: true,
      namespacedValue: 'pos.x',
      operands: {
        0: '5'
      },
      operandCount: 1,
      mapsTo: 'props'
    }

    const irrelevantRule: UnpackedGroupRule = {
      name: PlayerGroupRuleName.SET,
      negate: false,
      castType: PlayerGroupRuleCastType.CHAR,
      namespaced: true,
      namespacedValue: 'hasWonGame',
      operands: {},
      operandCount: 0,
      mapsTo: 'props'
    }

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={[PlayerGroupRuleMode.AND, vi.fn()]}
          rulesState={[
            [initialRule, irrelevantRule],
            changeMock
          ]}
        />
      </KitchenSink>
    )

    await userEvent.type(await screen.findByDisplayValue('5'), '6')

    expect(getLatestChange(changeMock)([initialRule, irrelevantRule])).toStrictEqual([{
      name: 'GT',
      negate: false,
      castType: PlayerGroupRuleCastType.DOUBLE,
      operands: {
        0: '56'
      },
      operandCount: 1,
      mapsTo: 'props',
      namespaced: true,
      namespacedValue: 'pos.x'
    }, irrelevantRule])
  })

  it('should update rule names', async () => {
    const changeMock = vi.fn()

    const initialRule: UnpackedGroupRule = {
      name: PlayerGroupRuleName.LT,
      negate: false,
      castType: PlayerGroupRuleCastType.DOUBLE,
      namespaced: true,
      namespacedValue: 'pos.x',
      operands: {
        0: '5'
      },
      operandCount: 1,
      mapsTo: 'props'
    }

    const irrelevantRule: UnpackedGroupRule = {
      name: PlayerGroupRuleName.SET,
      negate: false,
      castType: PlayerGroupRuleCastType.CHAR,
      namespaced: true,
      namespacedValue: 'hasWonGame',
      operands: {},
      operandCount: 0,
      mapsTo: 'props'
    }

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={[PlayerGroupRuleMode.AND, vi.fn()]}
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
      namespaced: true,
      namespacedValue: 'pos.x',
      operands: {
        0: '5'
      },
      operandCount: 1,
      mapsTo: 'props'
    }, irrelevantRule])
  })

  it('should update rule mode to $or', async () => {
    const changeMock = vi.fn()

    const rules: UnpackedGroupRule[] = [
      {
        name: PlayerGroupRuleName.LT,
        negate: false,
        castType: PlayerGroupRuleCastType.DATETIME,
        namespaced: false,
        namespacedValue: '',
        operands: {
          0: '2022-03-03'
        },
        operandCount: 1,
        mapsTo: 'createdAt'
      },
      {
        name: PlayerGroupRuleName.GT,
        negate: false,
        castType: PlayerGroupRuleCastType.DATETIME,
        namespaced: false,
        namespacedValue: '',
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
          ruleModeState={[PlayerGroupRuleMode.AND, changeMock]}
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

    const rules: UnpackedGroupRule[] = [
      {
        name: PlayerGroupRuleName.LT,
        negate: false,
        castType: PlayerGroupRuleCastType.DATETIME,
        namespaced: false,
        namespacedValue: '',
        operands: {
          0: '2022-03-03'
        },
        operandCount: 1,
        mapsTo: 'createdAt'
      },
      {
        name: PlayerGroupRuleName.GT,
        negate: false,
        castType: PlayerGroupRuleCastType.DATETIME,
        namespaced: false,
        namespacedValue: '',
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
          ruleModeState={[PlayerGroupRuleMode.OR, changeMock]}
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

    const initialRule: UnpackedGroupRule = {
      name: PlayerGroupRuleName.LT,
      negate: false,
      castType: PlayerGroupRuleCastType.DATETIME,
      namespaced: false,
      namespacedValue: '',
      operands: {
        0: '5'
      },
      operandCount: 1,
      mapsTo: 'createdAt'
    }

    const irrelevantRule: UnpackedGroupRule = {
      name: PlayerGroupRuleName.SET,
      negate: false,
      castType: PlayerGroupRuleCastType.CHAR,
      namespaced: true,
      namespacedValue: 'hasWonGame',
      operands: {},
      operandCount: 0,
      mapsTo: 'props'
    }

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={[PlayerGroupRuleMode.AND, vi.fn()]}
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
      namespaced: false,
      namespacedValue: '',
      operands: {
        0: ''
      },
      operandCount: 1,
      mapsTo: 'lastSeenAt'
    }, irrelevantRule])
  })

  it('should update prop key names', async () => {
    const changeMock = vi.fn()

    const initialRule: UnpackedGroupRule = {
      name: PlayerGroupRuleName.SET,
      negate: false,
      castType: PlayerGroupRuleCastType.CHAR,
      namespaced: true,
      namespacedValue: 'hasLoggedIn',
      operands: {},
      operandCount: 0,
      mapsTo: 'props'
    }

    const irrelevantRule: UnpackedGroupRule = {
      name: PlayerGroupRuleName.LT,
      negate: false,
      castType: PlayerGroupRuleCastType.DATETIME,
      namespaced: false,
      namespacedValue: '',
      operands: {
        0: '5'
      },
      operandCount: 1,
      mapsTo: 'createdAt'
    }

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={[PlayerGroupRuleMode.AND, vi.fn()]}
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
      namespaced: true,
      namespacedValue: 'hasLoggedIn1',
      operands: {},
      operandCount: 0,
      mapsTo: 'props'
    }, irrelevantRule])
  })

  it('should update the cast type', async () => {
    const changeMock = vi.fn()

    const initialRule: UnpackedGroupRule = {
      name: PlayerGroupRuleName.SET,
      negate: false,
      castType: PlayerGroupRuleCastType.CHAR,
      namespaced: true,
      namespacedValue: 'hasLoggedIn',
      operands: {},
      operandCount: 0,
      mapsTo: 'props'
    }

    const irrelevantRule: UnpackedGroupRule = {
      name: PlayerGroupRuleName.LT,
      negate: false,
      castType: PlayerGroupRuleCastType.DATETIME,
      namespaced: false,
      namespacedValue: '',
      operands: {
        0: '5'
      },
      operandCount: 1,
      mapsTo: 'createdAt'
    }

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={[PlayerGroupRuleMode.AND, vi.fn()]}
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
      namespaced: true,
      namespacedValue: 'hasLoggedIn',
      operands: {},
      operandCount: 0,
      mapsTo: 'props'
    }, irrelevantRule])
  })

  it('should select meta props', async () => {
    const changeMock = vi.fn()

    const initialRule: UnpackedGroupRule = {
      name: PlayerGroupRuleName.LT,
      negate: false,
      castType: PlayerGroupRuleCastType.DATETIME,
      namespaced: false,
      namespacedValue: '',
      operands: {
        0: '5'
      },
      operandCount: 1,
      mapsTo: 'createdAt'
    }

    const irrelevantRule: UnpackedGroupRule = {
      name: PlayerGroupRuleName.SET,
      negate: false,
      castType: PlayerGroupRuleCastType.CHAR,
      namespaced: true,
      namespacedValue: 'hasWonGame',
      operands: {},
      operandCount: 0,
      mapsTo: 'props'
    }

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={[PlayerGroupRuleMode.AND, vi.fn()]}
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
      namespaced: true,
      namespacedValue: 'META_WINDOW_MODE',
      operands: {
        0: ''
      },
      operandCount: 1,
      mapsTo: 'props'
    }, irrelevantRule])
  })

  it('should remove operands for a rule with no operands', async () => {
    const changeMock = vi.fn()

    const initialRule: UnpackedGroupRule = {
      name: PlayerGroupRuleName.LT,
      negate: false,
      castType: PlayerGroupRuleCastType.DOUBLE,
      namespaced: true,
      namespacedValue: 'pos.x',
      operands: {
        0: '5'
      },
      operandCount: 1,
      mapsTo: 'props'
    }

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={[PlayerGroupRuleMode.AND, vi.fn()]}
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
      namespaced: true,
      namespacedValue: 'pos.x',
      operands: {},
      operandCount: 0,
      mapsTo: 'props'
    }])
  })

  it('should select the stat value rule', async () => {
    const changeMock = vi.fn()

    const initialRule: UnpackedGroupRule = {
      name: PlayerGroupRuleName.GTE,
      negate: false,
      castType: PlayerGroupRuleCastType.DOUBLE,
      namespaced: true,
      namespacedValue: 'pos.x',
      operands: {
        0: '5'
      },
      operandCount: 1,
      mapsTo: 'props'
    }

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={[PlayerGroupRuleMode.AND, vi.fn()]}
          rulesState={[
            [initialRule],
            changeMock
          ]}
        />
      </KitchenSink>
    )

    await userEvent.click(await screen.findByText('prop with key'))
    await userEvent.click(await screen.findByText('value for stat'))

    expect(getLatestChange(changeMock)([initialRule])).toStrictEqual([{
      name: 'EQUALS',
      negate: false,
      castType: 'DOUBLE',
      namespaced: true,
      namespacedValue: '',
      operands: {
        0: ''
      },
      operandCount: 1,
      mapsTo: 'statValue'
    }])
  })

  it('should select the leaderboard entry score rule', async () => {
    const changeMock = vi.fn()

    const initialRule: UnpackedGroupRule = {
      name: PlayerGroupRuleName.GTE,
      negate: false,
      castType: PlayerGroupRuleCastType.DOUBLE,
      namespaced: true,
      namespacedValue: 'pos.x',
      operands: {
        0: '5'
      },
      operandCount: 1,
      mapsTo: 'props'
    }

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={[PlayerGroupRuleMode.AND, vi.fn()]}
          rulesState={[
            [initialRule],
            changeMock
          ]}
        />
      </KitchenSink>
    )

    await userEvent.click(await screen.findByText('prop with key'))
    await userEvent.click(await screen.findByText('score in leaderboard'))

    expect(getLatestChange(changeMock)([initialRule])).toStrictEqual([{
      name: 'EQUALS',
      negate: false,
      castType: 'DOUBLE',
      namespaced: true,
      namespacedValue: '',
      operands: {
        0: ''
      },
      operandCount: 1,
      mapsTo: 'leaderboardEntryScore'
    }])
  })

  it('should render the correct placeholder for the namespacedValue of the stat value rule', async () => {
    const initialRule: UnpackedGroupRule = {
      name: PlayerGroupRuleName.GTE,
      negate: false,
      castType: PlayerGroupRuleCastType.DOUBLE,
      namespaced: true,
      namespacedValue: '',
      operands: {
        0: '5'
      },
      operandCount: 1,
      mapsTo: 'statValue'
    }

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={[PlayerGroupRuleMode.AND, vi.fn()]}
          rulesState={[
            [initialRule],
            vi.fn()
          ]}
        />
      </KitchenSink>
    )

    expect(await screen.findByPlaceholderText('Internal name')).toBeInTheDocument()
  })

  it('should render the correct placeholder for the namespacedValue of the leaderboard entry score rule', async () => {
    const initialRule: UnpackedGroupRule = {
      name: PlayerGroupRuleName.GTE,
      negate: false,
      castType: PlayerGroupRuleCastType.DOUBLE,
      namespaced: true,
      namespacedValue: '',
      operands: {
        0: '5'
      },
      operandCount: 1,
      mapsTo: 'leaderboardEntryScore'
    }

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={[PlayerGroupRuleMode.AND, vi.fn()]}
          rulesState={[
            [initialRule],
            vi.fn()
          ]}
        />
      </KitchenSink>
    )

    expect(await screen.findByPlaceholderText('Internal name')).toBeInTheDocument()
  })

  it('should render the correct placeholder for the namespacedValue of the prop with key rule', async () => {
    const initialRule: UnpackedGroupRule = {
      name: PlayerGroupRuleName.GTE,
      negate: false,
      castType: PlayerGroupRuleCastType.DOUBLE,
      namespaced: true,
      namespacedValue: '',
      operands: {
        0: '5'
      },
      operandCount: 1,
      mapsTo: 'props'
    }

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={[PlayerGroupRuleMode.AND, vi.fn()]}
          rulesState={[
            [initialRule],
            vi.fn()
          ]}
        />
      </KitchenSink>
    )

    expect(await screen.findByPlaceholderText('Key')).toBeInTheDocument()
  })

  it('should not render the namespacedValue input for a meta prop', () => {
    const initialRule: UnpackedGroupRule = {
      name: PlayerGroupRuleName.EQUALS,
      negate: false,
      castType: PlayerGroupRuleCastType.DOUBLE,
      namespaced: true,
      namespacedValue: 'META_DEV_BUILD',
      operands: {
        0: '1'
      },
      operandCount: 1,
      mapsTo: 'props'
    }

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={[PlayerGroupRuleMode.AND, vi.fn()]}
          rulesState={[
            [initialRule],
            vi.fn()
          ]}
        />
      </KitchenSink>
    )

    expect(screen.queryByTestId('namespaced-value')).not.toBeInTheDocument()
  })

  it('should render errors', async () => {
    axiosMock.reset()
    axiosMock.onGet('http://talo.api/games/1/player-groups/rules').networkErrorOnce()

    render(
      <KitchenSink states={[{ node: activeGameState, initialValue: activeGameValue }]}>
        <GroupRules
          ruleModeState={[PlayerGroupRuleMode.AND, vi.fn()]}
          rulesState={[[], vi.fn()]}
        />
      </KitchenSink>
    )

    expect(await screen.findByText('Network Error')).toBeInTheDocument()
  })
})
