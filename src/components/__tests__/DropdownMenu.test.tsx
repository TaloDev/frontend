import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import KitchenSink from '../../utils/KitchenSink'
import DropdownMenu from '../DropdownMenu'
import Button from '../Button'

describe('<DropdownMenu />', () => {
  it('should render list options correctly', async () => {
    render(
      <KitchenSink>
        <DropdownMenu
          options={[
            {
              label: 'Option 1',
              onClick: vi.fn
            },
            {
              label: 'Option 2',
              onClick: vi.fn
            }
          ]}
        >
          {(setOpen) => (
            <Button
              type='button'
              onClick={() => setOpen(true)}
              variant='small'
            >
              Open me
            </Button>
          )}
        </DropdownMenu>
      </KitchenSink>
    )

    await userEvent.click(screen.getByText('Open me'))
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })

  it('should handle list option clicks', async () => {
    const opt1Mock = vi.fn()
    const opt2Mock = vi.fn()

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
              onClick={() => setOpen(true)}
              variant='small'
            >
              Open me
            </Button>
          )}
        </DropdownMenu>
      </KitchenSink>
    )

    await userEvent.click(screen.getByText('Open me'))
    await userEvent.click(screen.getByText('Option 1'))
    expect(opt1Mock).toHaveBeenCalled()

    await userEvent.click(screen.getByText('Open me'))
    await userEvent.click(screen.getByText('Option 2'))
    expect(opt2Mock).toHaveBeenCalled()
  })
})
