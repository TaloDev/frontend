import { render, screen } from '@testing-library/react'
import { EventsPieTooltip } from '../EventsPieTooltip'

const realPiePayload = [
  { name: 'event-a', value: 10, payload: { name: 'event-a', value: 10, fill: '#fff' } },
]

describe('<EventsPieTooltip />', () => {
  it('renders nothing when inactive', () => {
    const { container } = render(
      <EventsPieTooltip active={false} payload={realPiePayload} total={20} />,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when the slice value is zero', () => {
    const { container } = render(
      <EventsPieTooltip
        active
        payload={[
          { name: 'event-a', value: 0, payload: { name: 'event-a', value: 0, fill: '#fff' } },
        ]}
        total={0}
      />,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders the event name, count and share percent for the hovered slice', () => {
    render(<EventsPieTooltip active payload={realPiePayload} total={20} />)

    expect(screen.getByText('event-a')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('50.0%')).toBeInTheDocument()
  })

  it('computes the share from value / total (does not read percent from payload)', () => {
    render(<EventsPieTooltip active payload={realPiePayload} total={4} />)

    expect(screen.getByText('250.0%')).toBeInTheDocument()
  })
})
