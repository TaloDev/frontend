/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'
import { RecoilRoot, RecoilState } from 'recoil'
import RecoilObserver from '../state/RecoilObserver'
import { Location, MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { SWRConfig } from 'swr'
import type { ReactNode } from 'react'

type SetLocationFunction = (location: Partial<Location>) => void

type CatchAllProps = {
  setLocation?: SetLocationFunction
}

function CatchAll({
  setLocation
}: CatchAllProps) {
  const location = useLocation()

  useEffect(() => {
    setLocation?.({ pathname: location.pathname, state: location.state })
  }, [location, setLocation])

  return null
}

type RendererProps<T> = {
  states: {
    node: RecoilState<T>
    initialValue?: T
    onChange?: (value: T) => T
  }[]
  children: ReactNode
}

function Renderer<T>({
  states,
  children
}: RendererProps<T>) {
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

type KitchenSinkProps = {
  states?: {
    node: RecoilState<any>
    initialValue?: any
    onChange?: (value: any) => void
  }[]
  initialEntries?: (string | Partial<Location>)[]
  children: ReactNode
  setLocation?: SetLocationFunction
  routePath?: string
}

export default function KitchenSink({
  states = [],
  children,
  initialEntries = ['/'],
  setLocation,
  routePath = '/'
}: KitchenSinkProps) {
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
