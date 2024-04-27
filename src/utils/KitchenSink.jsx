import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { RecoilRoot } from 'recoil'
import RecoilObserver from '../state/RecoilObserver'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { SWRConfig } from 'swr'

function CatchAll({ setLocation }) {
  const location = useLocation()

  useEffect(() => {
    setLocation?.({ pathname: location.pathname, state: location.state })
  }, [location])

  return null
}

CatchAll.propTypes = {
  setLocation: PropTypes.func
}

function Renderer({ states, children }) {
  return (
    <>
      {states.map(({ node, onChange }, idx) => {
        return (
          <RecoilObserver
            key={idx}
            node={node}
            onChange={onChange}
          />
        )
      })}

      {children}
    </>
  )
}

Renderer.propTypes = {
  states: PropTypes.arrayOf(PropTypes.shape({
    node: PropTypes.object.isRequired,
    initialValue: PropTypes.any,
    onChange: PropTypes.func
  })).isRequired,
  children: PropTypes.node.isRequired
}

export default function KitchenSink({ states = [], children, initialEntries = ['/'], setLocation, routePath = '/' }) {
  return (
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      <RecoilRoot
        initializeState={(snap) => {
          states.forEach(({ node, initialValue }) => {
            snap.set(node, initialValue)
          })
        }}
      >
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path={routePath} element={<Renderer states={states}>{children}</Renderer>} />
            <Route
              path='*'
              element={<CatchAll setLocation={setLocation} />}
            />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    </SWRConfig>
  )
}

KitchenSink.propTypes = {
  states: PropTypes.arrayOf(PropTypes.shape({
    node: PropTypes.object.isRequired,
    initialValue: PropTypes.any,
    onChange: PropTypes.func
  })),
  initialEntries: PropTypes.array,
  children: PropTypes.node.isRequired,
  setLocation: PropTypes.func,
  routePath: PropTypes.string
}
