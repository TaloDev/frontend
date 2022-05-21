import React from 'react'
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
    const setLocationMock = jest.fn()

    render(
      <KitchenSink setLocation={setLocationMock}>
        <RecoveryCodes codes={['abc123', 'efg456', 'hij789']} showCreateButton />
      </KitchenSink>
    )

    expect(screen.getByText('Create new codes')).toBeInTheDocument()

    userEvent.click(screen.getByText('Create new codes'))

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
    navigator.clipboard = { writeText: jest.fn() }

    const codes = ['abc123', 'efg456', 'hij789']
    render(
      <KitchenSink>
        <RecoveryCodes codes={codes} />
      </KitchenSink>
    )

    userEvent.click(screen.getByText('Copy codes'))
    expect(await screen.findByText('Copied')).toBeInTheDocument()

    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1)
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(['abc123', 'efg456', 'hij789'].join('\n\n'))
  })

  it('should let the user download codes', () => {
    const link = {
      click: jest.fn(),
      remove: jest.fn()
    }

    URL.createObjectURL = jest.fn(() => 'data')
    URL.revokeObjectURL = jest.fn()

    render(
      <KitchenSink>
        <RecoveryCodes codes={['abc123', 'efg456', 'hij789']} />
      </KitchenSink>
    )

    jest.spyOn(document, 'createElement').mockImplementation(() => link)

    userEvent.click(screen.getByText('Download codes'))

    expect(link.download).toEqual('talo-recovery-codes.txt')
    expect(link.href).toBeDefined()

    expect(link.click).toHaveBeenCalledTimes(1)
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1)
    expect(link.remove).toHaveBeenCalledTimes(1)
  })
})
