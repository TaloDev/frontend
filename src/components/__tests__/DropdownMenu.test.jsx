import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import KitchenSink from '../../utils/KitchenSink'
import DropdownMenu from '../DropdownMenu'
import Button from '../Button'

describe('<DropdownMenu />', () => {
  it('should render list options correctly', () => {
    render(
      <KitchenSink>
        <DropdownMenu
          options={[
            {
              label: 'Option 1',
              onClick: jest.fn
            },
            {
              label: 'Option 2',
              onClick: jest.fn
            }
          ]}
        >
          {(setOpen) => (
            <Button
              type='button'
              onClick={setOpen}
              variant='small'
            >
              Open me
            </Button>
          )}
        </DropdownMenu>
      </KitchenSink>
    )

    userEvent.click(screen.getByText('Open me'))
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })

  it('should handle list option clicks', () => {
    const opt1Mock = jest.fn()
    const opt2Mock = jest.fn()

    render(
      <KitchenSink>
        <DropdownMenu
          options={[
            {
              label: 'Option 1',
              onClick: opt1Mock
            },
            {
              label: 'Option 2',
              onClick: opt2Mock
            }
          ]}
        >
          {(setOpen) => (
            <Button
              type='button'
              onClick={setOpen}
              variant='small'
            >
              Open me
            </Button>
          )}
        </DropdownMenu>
      </KitchenSink>
    )

    userEvent.click(screen.getByText('Open me'))
    userEvent.click(screen.getByText('Option 1'))
    expect(opt1Mock).toHaveBeenCalled()

    userEvent.click(screen.getByText('Open me'))
    userEvent.click(screen.getByText('Option 2'))
    expect(opt2Mock).toHaveBeenCalled()
  })
})
