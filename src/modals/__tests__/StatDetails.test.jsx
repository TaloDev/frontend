import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StatDetails from '../StatDetails'
import api from '../../api/api'
import MockAdapter from 'axios-mock-adapter'
import activeGameState from '../../state/activeGameState'
import userState from '../../state/userState'
import userTypes from '../../constants/userTypes'
import KitchenSink from '../../utils/KitchenSink'

describe('<StatDetails />', () => {
  const axiosMock = new MockAdapter(api)
  const activeGameValue = { id: 1, name: 'Heart Heist' }

  it('should create a stat', async () => {
    axiosMock.onPost('http://talo.api/games/1/game-stats').replyOnce(200, { stat: { id: 2 } })

    const closeMock = vi.fn()
    const mutateMock = vi.fn()

    render(
      <KitchenSink
        states={[
          { node: userState, initialValue: { type: userTypes.ADMIN } },
          { node: activeGameState, initialValue: activeGameValue }
        ]}
      >
        <StatDetails modalState={[true, closeMock]} mutate={mutateMock} />
      </KitchenSink>
    )

    await userEvent.type(screen.getByLabelText('Internal name'), 'hearts-collected')
    await userEvent.type(screen.getByLabelText('Display name'), 'Hearts collected')
    await userEvent.click(screen.getByText('Yes'))
    await userEvent.type(screen.getByLabelText('Max change'), '30')
    await userEvent.type(screen.getByLabelText('Default value'), '52')

    await waitFor(() => expect(screen.getByText('Create')).toBeEnabled())
    await userEvent.click(screen.getByText('Create'))

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalled()
    })

    expect(mutateMock).toHaveBeenCalled()

    const stats = [
      { id: 1 }
    ]

    const mutator = mutateMock.mock.calls[0][0]
    expect(mutator({ stats })).toStrictEqual({
      stats: [...stats, { id: 2 }]
    })
  })

  it('should handle creation errors', async () => {
    axiosMock.onPost('http://talo.api/games/1/game-stats').networkErrorOnce()

    render(
      <KitchenSink
        states={[
          { node: userState, initialValue: { type: userTypes.ADMIN } },
          { node: activeGameState, initialValue: activeGameValue }
        ]}
      >
        <StatDetails modalState={[true, vi.fn()]} mutate={vi.fn()} />
      </KitchenSink>
    )

    await userEvent.type(screen.getByLabelText('Internal name'), 'hearts-collected')
    await userEvent.type(screen.getByLabelText('Display name'), 'Hearts collected')
    await userEvent.click(screen.getByText('Yes'))
    await userEvent.type(screen.getByLabelText('Default value'), '52')

    await waitFor(() => expect(screen.getByText('Create')).toBeEnabled())
    await userEvent.click(screen.getByText('Create'))

    expect(await screen.findByText('Network Error')).toBeInTheDocument()
  })

  it('should display an error if the default value is less than the min value', async () => {
    axiosMock.onPost('http://talo.api/games/1/game-stats').replyOnce(200, { stat: { id: 2 } })

    const closeMock = vi.fn()
    const mutateMock = vi.fn()

    render(
      <KitchenSink
        states={[
          { node: userState, initialValue: { type: userTypes.ADMIN } },
          { node: activeGameState, initialValue: activeGameValue }
        ]}
      >
        <StatDetails modalState={[true, closeMock]} mutate={mutateMock} />
      </KitchenSink>
    )

    await userEvent.type(screen.getByLabelText('Min value'), '60')
    await userEvent.type(screen.getByLabelText('Default value'), '52')

    expect(await screen.findByText('Default value must be more than the min value')).toBeInTheDocument()
  })

  it('should display an error if the default value is more than the max value', async () => {
    axiosMock.onPost('http://talo.api/games/1/game-stats').replyOnce(200, { stat: { id: 2 } })

    const closeMock = vi.fn()
    const mutateMock = vi.fn()

    render(
      <KitchenSink
        states={[
          { node: userState, initialValue: { type: userTypes.ADMIN } },
          { node: activeGameState, initialValue: activeGameValue }
        ]}
      >
        <StatDetails modalState={[true, closeMock]} mutate={mutateMock} />
      </KitchenSink>
    )

    await userEvent.type(screen.getByLabelText('Max value'), '52')
    await userEvent.type(screen.getByLabelText('Default value'), '60')

    expect(await screen.findByText('Default value must be less than the max value')).toBeInTheDocument()
  })

  it('should display an error if the min value is more than the max value', async () => {
    axiosMock.onPost('http://talo.api/games/1/game-stats').replyOnce(200, { stat: { id: 2 } })

    const closeMock = vi.fn()
    const mutateMock = vi.fn()

    render(
      <KitchenSink
        states={[
          { node: userState, initialValue: { type: userTypes.ADMIN } },
          { node: activeGameState, initialValue: activeGameValue }
        ]}
      >
        <StatDetails modalState={[true, closeMock]} mutate={mutateMock} />
      </KitchenSink>
    )

    await userEvent.type(screen.getByLabelText('Max value'), '52')
    await userEvent.type(screen.getByLabelText('Min value'), '60')

    expect(await screen.findByText('Max value must be more than the min value')).toBeInTheDocument()
  })

  it('should display an error if the max change is negative', async () => {
    axiosMock.onPost('http://talo.api/games/1/game-stats').replyOnce(200, { stat: { id: 2 } })

    const closeMock = vi.fn()
    const mutateMock = vi.fn()

    render(
      <KitchenSink
        states={[
          { node: userState, initialValue: { type: userTypes.ADMIN } },
          { node: activeGameState, initialValue: activeGameValue }
        ]}
      >
        <StatDetails modalState={[true, closeMock]} mutate={mutateMock} />
      </KitchenSink>
    )

    await userEvent.type(screen.getByLabelText('Max change'), '-8')

    expect(await screen.findByText('Max change must be a positive number')).toBeInTheDocument()
  })

  it('should close when clicking close', async () => {
    const closeMock = vi.fn()

    render(
      <KitchenSink
        states={[
          { node: userState, initialValue: { type: userTypes.ADMIN } },
          { node: activeGameState, initialValue: activeGameValue }
        ]}
      >
        <StatDetails modalState={[true, closeMock]} mutate={vi.fn()} />
      </KitchenSink>
    )

    await userEvent.click(screen.getByText('Close'))

    expect(closeMock).toHaveBeenCalled()
  })

  it('should update a stat', async () => {
    const closeMock = vi.fn()
    const mutateMock = vi.fn()

    const initialStat = {
      id: 1,
      internalName: 'hearts-collected',
      name: 'Hearts collected',
      global: false,
      minValue: null,
      defaultValue: 5,
      maxValue: null,
      maxChange: null,
      minTimeBetweenUpdates: 0
    }

    axiosMock.onPut('http://talo.api/games/1/game-stats/1').replyOnce(200, {
      stat: {
        ...initialStat,
        minValue: -10,
        maxValue: 30
      }
    })

    render(
      <KitchenSink
        states={[
          { node: userState, initialValue: { type: userTypes.ADMIN } },
          { node: activeGameState, initialValue: activeGameValue }
        ]}
      >
        <StatDetails modalState={[true, closeMock]} mutate={mutateMock} editingStat={initialStat} />
      </KitchenSink>
    )

    expect(await screen.findByDisplayValue('hearts-collected')).toBeDisabled()
    expect(await screen.findByDisplayValue('Hearts collected')).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText('Min value'), '-10')
    await userEvent.type(screen.getByLabelText('Max value'), '30')

    await waitFor(() => expect(screen.getByText('Update')).toBeEnabled())
    await userEvent.click(screen.getByText('Update'))

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalled()
    })

    expect(mutateMock).toHaveBeenCalled()

    const mutator = mutateMock.mock.calls[0][0]
    expect(mutator({ stats: [initialStat, { id: 2 }] })).toStrictEqual({
      stats: [
        {
          ...initialStat,
          minValue: -10,
          maxValue: 30
        },
        { id: 2 }
      ]
    })
  })

  it('should handle updating errors', async () => {
    const initialStat = {
      id: 1,
      internalName: 'hearts-collected',
      name: 'Hearts collected',
      global: false,
      minValue: null,
      defaultValue: 5,
      maxValue: null,
      maxChange: null,
      minTimeBetweenUpdates: 0
    }

    axiosMock.onPut('http://talo.api/games/1/game-stats/1').networkErrorOnce()

    render(
      <KitchenSink
        states={[
          { node: userState, initialValue: { type: userTypes.ADMIN } },
          { node: activeGameState, initialValue: activeGameValue }
        ]}
      >
        <StatDetails modalState={[true, vi.fn()]} mutate={vi.fn()} editingStat={initialStat} />
      </KitchenSink>
    )

    await waitFor(() => expect(screen.getByText('Update')).toBeEnabled())
    await userEvent.click(screen.getByText('Update'))

    expect(await screen.findByText('Network Error')).toBeInTheDocument()
  })

  it('should delete a stat', async () => {
    const closeMock = vi.fn()
    const mutateMock = vi.fn()

    const initialStat = {
      id: 1,
      internalName: 'hearts-collected',
      name: 'Hearts collected',
      global: false,
      minValue: null,
      defaultValue: 5,
      maxValue: null,
      maxChange: null,
      minTimeBetweenUpdates: 0
    }

    axiosMock.onDelete('http://talo.api/games/1/game-stats/1').replyOnce(200)
    window.confirm = vi.fn(() => true)

    render(
      <KitchenSink
        states={[
          { node: userState, initialValue: { type: userTypes.ADMIN } },
          { node: activeGameState, initialValue: activeGameValue }
        ]}
      >
        <StatDetails modalState={[true, closeMock]} mutate={mutateMock} editingStat={initialStat} />
      </KitchenSink>
    )

    await userEvent.click(screen.getByText('Delete'))

    await waitFor(() => {
      expect(closeMock).toHaveBeenCalled()
    })

    expect(mutateMock).toHaveBeenCalled()

    const mutator = mutateMock.mock.calls[0][0]
    expect(mutator({ stats: [initialStat, { id: 2 }] })).toStrictEqual({
      stats: [{ id: 2 }]
    })
  })

  it('should handle deletion errors', async () => {
    const initialStat = {
      id: 1,
      internalName: 'hearts-collected',
      name: 'Hearts collected',
      global: false,
      minValue: null,
      defaultValue: 5,
      maxValue: null,
      maxChange: null,
      minTimeBetweenUpdates: 0
    }

    axiosMock.onDelete('http://talo.api/games/1/game-stats/1').networkErrorOnce()
    window.confirm = vi.fn(() => true)

    render(
      <KitchenSink
        states={[
          { node: userState, initialValue: { type: userTypes.ADMIN } },
          { node: activeGameState, initialValue: activeGameValue }
        ]}
      >
        <StatDetails modalState={[true, vi.fn()]} mutate={vi.fn()} editingStat={initialStat} />
      </KitchenSink>
    )

    await userEvent.click(screen.getByText('Delete'))

    expect(await screen.findByText('Network Error')).toBeInTheDocument()
  })

  it('should not render the delete button for dev users', () => {
    const initialStat = {
      id: 1,
      internalName: 'hearts-collected',
      name: 'Hearts collected',
      global: false,
      minValue: null,
      defaultValue: 5,
      maxValue: null,
      maxChange: null,
      minTimeBetweenUpdates: 0
    }

    render(
      <KitchenSink
        states={[
          { node: userState, initialValue: { type: userTypes.DEV } },
          { node: activeGameState, initialValue: activeGameValue }
        ]}
      >
        <StatDetails modalState={[true, vi.fn()]} mutate={vi.fn()} editingStat={initialStat} />
      </KitchenSink>
    )

    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
  })
})
