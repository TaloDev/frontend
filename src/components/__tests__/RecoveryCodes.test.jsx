import React from 'react'
import { render, screen } from '@testing-library/react'
import RecoveryCodes from '../RecoveryCodes'
import userEvent from '@testing-library/user-event'
import routes from '../../constants/routes'
import { ConfirmPasswordAction } from '../../pages/ConfirmPassword'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'

describe('<RecoveryCodes />', () => {
  it('should render recovery codes', () => {
    render(<RecoveryCodes codes={['abc123', 'efg456', 'hij789']} />)

    expect(screen.getAllByRole('listitem')).toHaveLength(3)

    expect(screen.getByText('Copy codes')).toBeInTheDocument()

    expect(screen.getByText('Download codes')).toBeInTheDocument()

    expect(screen.queryByText('Create new codes')).not.toBeInTheDocument()
  })

  it('should render recovery codes when the withBackground prop is defined', () => {
    render(<RecoveryCodes codes={['abc123', 'efg456', 'hij789']} withBackground />)

    expect(screen.getAllByRole('listitem')).toHaveLength(3)

    expect(screen.getByText('Copy codes')).toBeInTheDocument()

    expect(screen.getByText('Download codes')).toBeInTheDocument()

    expect(screen.queryByText('Create new codes')).not.toBeInTheDocument()
  })

  it('should let the user start creating new codes', () => {
    const history = createMemoryHistory()

    render(
      <Router history={history}>
        <RecoveryCodes codes={['abc123', 'efg456', 'hij789']} showCreateButton />
      </Router>
    )

    expect(screen.getByText('Create new codes')).toBeInTheDocument()

    userEvent.click(screen.getByText('Create new codes'))

    expect(history.location.pathname).toBe(routes.confirmPassword)
    expect(history.location.state).toStrictEqual({
      onConfirmAction: ConfirmPasswordAction.CREATE_RECOVERY_CODES
    })
  })

  it('should let the user copy codes', async () => {
    navigator.clipboard = { writeText: jest.fn() }

    const codes = ['abc123', 'efg456', 'hij789']
    render(<RecoveryCodes codes={codes} />)

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

    render(<RecoveryCodes codes={['abc123', 'efg456', 'hij789']} />)

    jest.spyOn(document, 'createElement').mockImplementation(() => link)

    userEvent.click(screen.getByText('Download codes'))

    expect(link.download).toEqual('talo-recovery-codes.txt')
    expect(link.href).toBeDefined()

    expect(link.click).toHaveBeenCalledTimes(1)
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1)
    expect(link.remove).toHaveBeenCalledTimes(1)
  })
})
