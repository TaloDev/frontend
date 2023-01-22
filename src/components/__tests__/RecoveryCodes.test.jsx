import { render, screen, waitFor } from '@testing-library/react'
import RecoveryCodes from '../RecoveryCodes'
import userEvent from '@testing-library/user-event'
import routes from '../../constants/routes'
import { ConfirmPasswordAction } from '../../pages/ConfirmPassword'
import KitchenSink from '../../utils/KitchenSink'

describe('<RecoveryCodes />', () => {
  it('should render recovery codes', () => {
    render(
      <KitchenSink>
        <RecoveryCodes codes={['abc123', 'efg456', 'hij789']} />
      </KitchenSink>
    )

    expect(screen.getAllByRole('listitem')).toHaveLength(3)

    expect(screen.getByText('Copy codes')).toBeInTheDocument()

    expect(screen.getByText('Download codes')).toBeInTheDocument()

    expect(screen.queryByText('Create new codes')).not.toBeInTheDocument()
  })

  it('should render recovery codes when the withBackground prop is defined', () => {
    render(
      <KitchenSink>
        <RecoveryCodes codes={['abc123', 'efg456', 'hij789']} withBackground />
      </KitchenSink>
    )

    expect(screen.getAllByRole('listitem')).toHaveLength(3)

    expect(screen.getByText('Copy codes')).toBeInTheDocument()

    expect(screen.getByText('Download codes')).toBeInTheDocument()

    expect(screen.queryByText('Create new codes')).not.toBeInTheDocument()
  })

  it('should let the user start creating new codes', async () => {
    const setLocationMock = vi.fn()

    render(
      <KitchenSink setLocation={setLocationMock}>
        <RecoveryCodes codes={['abc123', 'efg456', 'hij789']} showCreateButton />
      </KitchenSink>
    )

    expect(screen.getByText('Create new codes')).toBeInTheDocument()

    await userEvent.click(screen.getByText('Create new codes'))

    await waitFor(() => {
      expect(setLocationMock).toHaveBeenCalledWith({
        pathname: routes.confirmPassword,
        state: {
          onConfirmAction: ConfirmPasswordAction.CREATE_RECOVERY_CODES
        }
      })
    })
  })

  it('should let the user copy codes', async () => {
    navigator.clipboard = { writeText: vi.fn() }

    const codes = ['abc123', 'efg456', 'hij789']
    render(
      <KitchenSink>
        <RecoveryCodes codes={codes} />
      </KitchenSink>
    )

    await userEvent.click(screen.getByText('Copy codes'))
    expect(await screen.findByText('Copied')).toBeInTheDocument()

    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1)
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(['abc123', 'efg456', 'hij789'].join('\n\n'))
  })

  it('should let the user download codes', async () => {
    const link = {
      click: vi.fn(),
      remove: vi.fn()
    }

    URL.createObjectURL = vi.fn(() => 'data')
    URL.revokeObjectURL = vi.fn()

    render(
      <KitchenSink>
        <RecoveryCodes codes={['abc123', 'efg456', 'hij789']} />
      </KitchenSink>
    )

    vi.spyOn(document, 'createElement').mockImplementation(() => link)

    await userEvent.click(screen.getByText('Download codes'))

    expect(link.download).toEqual('talo-recovery-codes.txt')
    expect(link.href).toBeDefined()

    expect(link.click).toHaveBeenCalledTimes(1)
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1)
    expect(link.remove).toHaveBeenCalledTimes(1)
  })
})
