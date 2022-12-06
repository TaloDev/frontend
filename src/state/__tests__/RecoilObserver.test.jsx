import React from 'react'
import { render, screen } from '@testing-library/react'
import { atom, RecoilRoot, useRecoilValue } from 'recoil'
import RecoilObserver from '../../state/RecoilObserver'

const dummyState = atom({
  key: 'dummy',
  default: {}
})

function ObserverDummy() {
  const user = useRecoilValue(dummyState)
  return (
    <p>{user.name ?? 'Not logged in'}</p>
  )
}

describe('<RecoilObserver />', () => {
  it('should render children if not waiting for an initial value', () => {
    render(
      <RecoilObserver node={dummyState}>
        <ObserverDummy />
      </RecoilObserver>,
      { wrapper: RecoilRoot }
    )

    expect(screen.getByText('Not logged in')).toBeInTheDocument()
  })

  it('should render children with the initial state instead of the default state', () => {
    render(
      <RecoilObserver node={dummyState} initialValue={{ name: 'Joe' }}>
        <ObserverDummy />
      </RecoilObserver>,
      { wrapper: RecoilRoot }
    )

    expect(screen.queryByText('Not logged in')).not.toBeInTheDocument()
    expect(screen.getByText('Joe')).toBeInTheDocument()
  })

  it('should listen for state changes', () => {
    const changeMock = vi.fn()

    render(
      <RecoilObserver node={dummyState} onChange={changeMock} initialValue={{ name: 'Joe' }}>
        <ObserverDummy />
      </RecoilObserver>,
      { wrapper: RecoilRoot }
    )

    expect(changeMock).toHaveBeenCalledWith({})
    expect(changeMock).toHaveBeenCalledWith({ name: 'Joe' })
  })
})
