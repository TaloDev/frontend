import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { Location, MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { RecoilRoot, RecoilState } from 'recoil'
import { SWRConfig } from 'swr'
import RecoilObserver from '../state/RecoilObserver'

type SetLocationFunction = (location: Partial<Location>) => void

type CatchAllProps = {
  setLocation?: SetLocationFunction
}

function CatchAll({ setLocation }: CatchAllProps) {
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

function Renderer<T>({ states, children }: RendererProps<T>) {
  return (
    <>
      {states.map(({ node, onChange }, idx) => {
        return <RecoilObserver key={idx} node={node} onChange={onChange} />
      })}

      {children}
    </>
  )
}

type KitchenSinkProps = {
  states?: {
    // oxlint-disable-next-line typescript/no-explicit-any
    node: RecoilState<any>
    // oxlint-disable-next-line typescript/no-explicit-any
    initialValue?: any
    // oxlint-disable-next-line typescript/no-explicit-any
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
  routePath = '/',
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
            <Route path='*' element={<CatchAll setLocation={setLocation} />} />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    </SWRConfig>
  )
}
