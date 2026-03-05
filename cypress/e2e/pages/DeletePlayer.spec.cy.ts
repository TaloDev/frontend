const GAME_TOKEN = 'test-token'
const BASE_URL = `/manage/${GAME_TOKEN}/delete`
const GAME_URL = `http://talo.api/public/players/${GAME_TOKEN}/game`
const LOGIN_URL = `http://talo.api/public/players/${GAME_TOKEN}/login`
const VERIFY_URL = `http://talo.api/public/players/${GAME_TOKEN}/verify`
const DELETE_URL = `http://talo.api/public/players/${GAME_TOKEN}`

function stubGame() {
  cy.intercept('GET', GAME_URL, {
    statusCode: 200,
    body: { game: { name: 'Superstatic' } },
  })
}

describe('DeletePlayer', () => {
  it('should complete the happy path without verification', () => {
    stubGame()

    cy.intercept('POST', LOGIN_URL, {
      statusCode: 200,
      body: {
        alias: { identifier: 'player1' },
        sessionToken: 'tok-abc',
      },
    })

    cy.intercept('DELETE', DELETE_URL, {
      statusCode: 204,
    })

    cy.visitAsGuest(BASE_URL)
    cy.findByText('Delete your Superstatic account').should('exist')

    cy.findByLabelText('Identifier').type('player1')
    cy.findByLabelText('Password').type('password123')
    cy.findByText('Login').click()

    cy.findByText('Confirm deletion').should('exist')

    cy.findByLabelText('Confirm your identifier').type('player1')
    cy.findByText('Delete account').click()

    cy.findByText('Account deleted').should('exist')
  })

  it('should complete the happy path with verification', () => {
    stubGame()

    cy.intercept('POST', LOGIN_URL, {
      statusCode: 200,
      body: {
        verificationRequired: true,
        aliasId: 42,
      },
    })

    cy.intercept('POST', VERIFY_URL, {
      statusCode: 200,
      body: {
        alias: { identifier: 'player1' },
        sessionToken: 'tok-abc',
      },
    })

    cy.intercept('DELETE', DELETE_URL, {
      statusCode: 204,
    })

    cy.visitAsGuest(BASE_URL)

    cy.findByLabelText('Identifier').type('player1')
    cy.findByLabelText('Password').type('password123')
    cy.findByText('Login').click()

    cy.findByText('Verify your identity').should('exist')

    cy.findByLabelText('Verification code').type('123456')
    cy.findByText('Verify').click()

    cy.findByText('Confirm deletion').should('exist')

    cy.findByLabelText('Confirm your identifier').type('player1')
    cy.findByText('Delete account').click()

    cy.findByText('Account deleted').should('exist')
  })

  it('should show an error on login failure', () => {
    stubGame()

    cy.intercept('POST', LOGIN_URL, {
      statusCode: 401,
      body: { message: 'Invalid credentials' },
    })

    cy.visitAsGuest(BASE_URL)

    cy.findByLabelText('Identifier').type('player1')
    cy.findByLabelText('Password').type('wrongpassword')
    cy.findByText('Login').click()

    cy.findByText('Invalid credentials').should('exist')
  })

  it('should show an error on verify failure', () => {
    stubGame()

    cy.intercept('POST', LOGIN_URL, {
      statusCode: 200,
      body: {
        verificationRequired: true,
        aliasId: 42,
      },
    })

    cy.intercept('POST', VERIFY_URL, {
      statusCode: 400,
      body: { message: 'Invalid verification code' },
    })

    cy.visitAsGuest(BASE_URL)

    cy.findByLabelText('Identifier').type('player1')
    cy.findByLabelText('Password').type('password123')
    cy.findByText('Login').click()

    cy.findByLabelText('Verification code').type('000000')
    cy.findByText('Verify').click()

    cy.findByText('Invalid verification code').should('exist')
  })

  it('should disable the Login button until both fields are filled', () => {
    stubGame()

    cy.visitAsGuest(BASE_URL)

    cy.findByText('Login').should('be.disabled')

    cy.findByLabelText('Identifier').type('player1')
    cy.findByText('Login').should('be.disabled')

    cy.findByLabelText('Password').type('password123')
    cy.findByText('Login').should('be.enabled')
  })

  it('should disable the Delete account button until the confirmation matches the identifier', () => {
    stubGame()

    cy.intercept('POST', LOGIN_URL, {
      statusCode: 200,
      body: {
        alias: { identifier: 'player1' },
        sessionToken: 'tok-abc',
      },
    })

    cy.visitAsGuest(BASE_URL)

    cy.findByLabelText('Identifier').type('player1')
    cy.findByLabelText('Password').type('password123')
    cy.findByText('Login').click()

    cy.findByText('Confirm deletion').should('exist')
    cy.findByText('Delete account').should('be.disabled')

    cy.findByLabelText('Confirm your identifier').type('player')
    cy.findByText('Delete account').should('be.disabled')

    cy.findByLabelText('Confirm your identifier').type('1')
    cy.findByText('Delete account').should('be.enabled')
  })

  it('should disable the Verify button until exactly 6 characters are entered', () => {
    stubGame()

    cy.intercept('POST', LOGIN_URL, {
      statusCode: 200,
      body: {
        verificationRequired: true,
        aliasId: 42,
      },
    })

    cy.visitAsGuest(BASE_URL)

    cy.findByLabelText('Identifier').type('player1')
    cy.findByLabelText('Password').type('password123')
    cy.findByText('Login').click()

    cy.findByText('Verify your identity').should('exist')
    cy.findByText('Verify').should('be.disabled')

    cy.findByLabelText('Verification code').type('12345')
    cy.findByText('Verify').should('be.disabled')

    cy.findByLabelText('Verification code').type('6')
    cy.findByText('Verify').should('be.enabled')
  })

  it('should show an error when the game token is invalid', () => {
    cy.intercept('GET', GAME_URL, {
      statusCode: 404,
      body: { message: 'Game not found' },
    })

    cy.visitAsGuest(BASE_URL)

    cy.findByText('Game not found').should('exist')
  })
})
