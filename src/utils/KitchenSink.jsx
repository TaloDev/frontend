import React from 'react'
import PropTypes from 'prop-types'
import { RecoilRoot } from 'recoil'
import RecoilObserver from '../state/RecoilObserver'
import { MemoryRouter, Route } from 'react-router-dom'

function KitchenSink({ states, children, initialEntries, setLocation, routePath }) {
  const Renderer = () => states.reduce((Acc, { node, initialValue }) => {
    return React.cloneElement(
      <RecoilObserver node={node} initialValue={initialValue} />,
      {},
      Acc
    )
  }, children)

  return (
    <RecoilRoot>
      <MemoryRouter initialEntries={initialEntries}>
        <Route path={routePath} component={Renderer} />
        <Route
          path='*'
          render={({ location }) => {
            setLocation?.({ pathname: location.pathname, state: location.state })
            return null
          }}
        />
      </MemoryRouter>
    </RecoilRoot>
  )
}

KitchenSink.propTypes = {
  states: PropTypes.arrayOf(PropTypes.shape({
    node: PropTypes.object.isRequired,
    initialValue: PropTypes.any.isRequired
  })),
  initialEntries: PropTypes.array,
  children: PropTypes.node.isRequired,
  setLocation: PropTypes.func,
  routePath: PropTypes.string
}

KitchenSink.defaultProps = {
  states: [],
  initialEntries: ['/'],
  routePath: '/'
}

export default KitchenSink
