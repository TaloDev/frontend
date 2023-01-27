import '@testing-library/cypress/add-commands'

Cypress.Commands.add('stubDashboardCalls', () => {
  cy.intercept('GET', /http:\/\/talo\.api\/games\/1\/headlines\/(.*)/, {
    statusCode: 200,
    body: {
      count: Cypress._.random(0, 100)
    }
  })

  cy.intercept('GET', 'http://talo.api/games/1/game-stats', {
    statusCode: 200,
    fixture: 'responses/game-stats/global'
  })
})

Cypress.Commands.add('visitAsGuest', (url = '/') => {
  cy.intercept('GET', 'http://talo.api/public/users/refresh', {
    statusCode: 401
  })

  cy.stubDashboardCalls()

  cy.visit(url)
})

Cypress.Commands.add('login', (userType = 'dev', url = '/') => {
  cy.intercept('GET', 'http://talo.api/public/users/refresh', {
    statusCode: 200,
    fixture: `responses/auth/${userType}`
  })

  cy.stubDashboardCalls()

  cy.visit(url)
})
