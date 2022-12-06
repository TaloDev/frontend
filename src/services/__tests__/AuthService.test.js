import AuthService from '../AuthService'

describe('AuthService', () => {
  it('should set the token', () => {
    AuthService.setToken('abc123')
    expect(AuthService.getToken()).toBe('abc123')
  })

  it('should set the loggedOut key after reloading', () => {
    const reloadMock = vi.fn()

    const { reload } = window.location
    delete window.location
    window.location = { reload: reloadMock }

    AuthService.reload()

    expect(window.localStorage.getItem('loggedOut')).toBe('true')
    expect(reloadMock).toHaveBeenCalled()

    window.location.reload = reload
  })
})
