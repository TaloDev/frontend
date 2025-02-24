import { render, screen } from '@testing-library/react'
import PlayerAliases from '../PlayerAliases'
import { PlayerAlias, PlayerAliasService } from '../../entities/playerAlias'
import playerAliasMock from '../../__mocks__/playerAliasMock'

describe('<PlayerAliases />', () => {
  it('should render an alias', () => {
    const aliases: PlayerAlias[] = [
      playerAliasMock({ service: PlayerAliasService.STEAM, identifier: 'yxre12' })
    ]

    render(<PlayerAliases aliases={aliases} />)

    expect(screen.getByText(aliases[0].identifier)).toBeInTheDocument()
  })

  it('should render the latest alias and an indicator for how many more', () => {
    const aliases: PlayerAlias[] = [
      playerAliasMock({ service: PlayerAliasService.STEAM, identifier: 'yxre12', lastSeenAt: '2024-10-28 10:00:00' }),
      playerAliasMock({ service: PlayerAliasService.USERNAME, identifier: 'ryet12', lastSeenAt: '2024-10-27 10:00:00' }),
      playerAliasMock({ service: PlayerAliasService.EPIC, identifier: 'epic_23rd', lastSeenAt: '2024-10-26 10:00:00' })
    ]

    render(<PlayerAliases aliases={aliases} />)

    expect(screen.getByText(aliases[0].identifier)).toBeInTheDocument()
    expect(screen.getByText('+ 2 more')).toBeInTheDocument()
  })

  it('should render none if the player has none', () => {
    const aliases: PlayerAlias[] = []

    render(<PlayerAliases aliases={aliases} />)

    expect(screen.getByText('None')).toBeInTheDocument()
  })
})
