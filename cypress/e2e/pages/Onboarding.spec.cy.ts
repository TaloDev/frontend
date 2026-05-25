describe('Onboarding', () => {
  const createGameResponse = {
    game: {
      id: 2,
      name: 'My New Game',
      props: [],
      playerCount: 0,
      createdAt: '2026-05-01T00:00:00Z',
    },
  }

  beforeEach(() => {
    cy.intercept('GET', 'http://talo.api/public/users/refresh', {
      statusCode: 200,
      fixture: 'responses/auth/register',
    })

    cy.intercept('POST', 'http://talo.api/games', {
      statusCode: 200,
      body: createGameResponse,
    })

    cy.stubDashboardCalls()
  })

  it('should show onboarding for a user with no games', () => {
    cy.visit('/')

    cy.findByText("Welcome to Talo. Let's get started!").should('exist')
    cy.findByPlaceholderText('Game name').should('exist')
    cy.findByText('Create').should('be.disabled')
  })

  it('should let a user create a game and see next steps', () => {
    cy.visit('/')

    cy.findByText("Welcome to Talo. Let's get started!").should('exist')
    cy.findByPlaceholderText('Game name').type('My New Game')
    cy.findByText('Create').click()

    cy.findByText('My New Game created!').should('exist')
    cy.findByText('Get an access key').should('exist')
    cy.findByText('Install Talo').should('exist')
    cy.findByText('Customise settings').should('exist')
    cy.findByText('Continue to dashboard').should('exist')
  })

  it('should open the access key page in a new tab', () => {
    cy.visit('/')

    cy.findByPlaceholderText('Game name').type('My New Game')
    cy.findByText('Create').click()

    cy.findByText('access key')
      .should('have.attr', 'href', '/api-keys')
      .should('have.attr', 'target', '_blank')
      .should('have.attr', 'rel', 'noreferrer')
  })

  it('should open the settings page in a new tab', () => {
    cy.visit('/')

    cy.findByPlaceholderText('Game name').type('My New Game')
    cy.findByText('Create').click()

    cy.findByText('settings page')
      .should('have.attr', 'href', '/game-settings')
      .should('have.attr', 'target', '_blank')
      .should('have.attr', 'rel', 'noreferrer')
  })

  it('should open the correct docs URL', () => {
    cy.visit('/')

    cy.findByPlaceholderText('Game name').type('My New Game')
    cy.findByText('Create').click()

    cy.findByText('installation docs').click()

    cy.findByRole('dialog').findByText('Godot plugin').click()
    cy.findByText('Save selection').click()

    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen')
    })

    cy.findByText('installation docs').click()
    cy.get('@windowOpen').should(
      'have.been.calledWithExactly',
      'https://docs.trytalo.com/docs/godot/install',
      '_blank',
    )
  })

  it('should show the dashboard after completing onboarding', () => {
    cy.intercept('GET', /http:\/\/talo\.api\/games\/2\/headlines\/average_session_duration/, {
      statusCode: 200,
      body: { hours: 1, minutes: 0, seconds: 0 },
    })

    cy.intercept('GET', /http:\/\/talo\.api\/games\/2\/headlines\/(.*)/, {
      statusCode: 200,
      body: { count: 0 },
    })

    cy.intercept('GET', 'http://talo.api/games/2/game-stats', {
      statusCode: 200,
      body: { stats: [] },
    })

    cy.intercept('GET', /http:\/\/talo\.api\/games\/2\/player-groups\/pinned/, {
      statusCode: 200,
      body: { groups: [] },
    })

    cy.visit('/')

    cy.findByText("Welcome to Talo. Let's get started!").should('exist')
    cy.findByPlaceholderText('Game name').type('My New Game')
    cy.findByText('Create').click()

    cy.findByText('Continue to dashboard').click()

    cy.findByText('My New Game dashboard').should('exist')
  })

  it('should not show onboarding for a user with an existing game', () => {
    cy.intercept('GET', 'http://talo.api/public/users/refresh', {
      statusCode: 200,
      fixture: 'responses/auth/owner',
    })

    cy.visit('/')

    cy.findByText('Superstatic dashboard').should('exist')
  })
})
