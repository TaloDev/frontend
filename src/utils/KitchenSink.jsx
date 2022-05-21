import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { RecoilRoot } from 'recoil'
import RecoilObserver from '../state/RecoilObserver'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'

function CatchAll({ setLocation }) {
  const location = useLocation()

  useEffect(() => {
    setLocation?.({ pathname: location.pathname, state: location.state })
  }, [location])

  return null
}

function KitchenSink({ states, children, initialEntries, setLocation, routePath }) {
  const Renderer = () => states.reduce((Acc, { node, initialValue, onChange }) => {
    return React.cloneElement(
      <RecoilObserver node={node} initialValue={initialValue} onChange={onChange} />,
      {},
      Acc
    )
  }, children)

  return (
    <RecoilRoot>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path={routePath} element={<Renderer />} />
          <Route
            path='*'
            element={<CatchAll setLocation={setLocation} />}
          />
        </Routes>
      </MemoryRouter>
    </RecoilRoot>
  )
}

KitchenSink.propTypes = {
  states: PropTypes.arrayOf(PropTypes.shape({
    node: PropTypes.object.isRequired,
    initialValue: PropTypes.any.isRequired,
    onChange: PropTypes.func
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
