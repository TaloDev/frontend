import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PropBadges } from '../PropBadges'

describe('<PropBadges />', () => {
  it('should render a single badge per unique key', () => {
    render(
      <PropBadges
        props={[
          { key: 'b', value: '2' },
          { key: 'a', value: '1' },
        ]}
      />,
    )

    const badges = screen.getAllByText(/=/)
    expect(badges).toHaveLength(2)
    expect(badges[0]).toHaveTextContent('a = 1')
    expect(badges[1]).toHaveTextContent('b = 2')
  })

  it('should pass the first value to onClick for a merged badge', async () => {
    const onClick = vi.fn()
    render(
      <PropBadges
        props={[
          { key: 'weapons[]', value: 'sword' },
          { key: 'weapons[]', value: 'axe' },
        ]}
        onClick={onClick}
      />,
    )

    await userEvent.click(screen.getByRole('button'))

    expect(onClick).toHaveBeenCalledWith({ key: 'weapons[]', value: 'sword' })
  })

  it('should merge props with the same key suffixed with [] into one array badge', () => {
    render(
      <PropBadges
        props={[
          { key: 'weapons[]', value: 'sword' },
          { key: 'weapons[]', value: 'axe' },
          { key: 'weapons[]', value: 'bow' },
        ]}
      />,
    )

    const badges = screen.getAllByText(/=/)
    expect(badges).toHaveLength(1)
    expect(badges[0]).toHaveTextContent('weapons[] = sword, axe, bow')
  })

  it('should keep a non-array key separate from an array key', () => {
    render(
      <PropBadges
        props={[
          { key: 'mainhand', value: 'sword' },
          { key: 'weapons[]', value: 'axe' },
          { key: 'weapons[]', value: 'bow' },
        ]}
      />,
    )

    const badges = screen.getAllByText(/=/)
    expect(badges).toHaveLength(2)
    expect(badges[0]).toHaveTextContent('mainhand = sword')
    expect(badges[1]).toHaveTextContent('weapons[] = axe, bow')
  })
})
