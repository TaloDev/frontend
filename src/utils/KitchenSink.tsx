import { useAtomValue, type WritableAtom, Provider } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { useEffect, type ReactNode } from 'react'
import { Location, MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { SWRConfig } from 'swr'

type SetLocationFunction = (location: Partial<Location>) => void

// oxlint-disable-next-line typescript/no-explicit-any
type StateEntry<T = any> = {
  // oxlint-disable-next-line typescript/no-explicit-any
  node: WritableAtom<T, [any], void>
  initialValue?: T
  onChange?: (value: T) => void
}

function CatchAll({ setLocation }: { setLocation?: SetLocationFunction }) {
  const location = useLocation()

  useEffect(() => {
    setLocation?.({ pathname: location.pathname, state: location.state })
  }, [location, setLocation])

  return null
}

function Observer<T>({
  node,
  onChange,
}: {
  // oxlint-disable-next-line typescript/no-explicit-any
  node: WritableAtom<T, [any], void>
  onChange: (value: T) => void
}) {
  const value = useAtomValue(node)

  useEffect(() => {
    onChange(value)
  }, [onChange, value])

  return null
}

type HydrateStatesProps = {
  states: StateEntry[]
  children: ReactNode
}

function HydrateStates({ states, children }: HydrateStatesProps) {
  useHydrateAtoms(
    states
      .filter((s) => s.initialValue !== undefined)
      .map((s) => [s.node, s.initialValue] as [StateEntry['node'], unknown]),
  )

  return (
    <>
      {states
        .filter((s) => s.onChange)
        .map((s, idx) => (
          <Observer key={idx} node={s.node} onChange={s.onChange!} />
        ))}
      {children}
    </>
  )
}

type KitchenSinkProps = {
  states?: StateEntry[]
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
      <Provider>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route
              path={routePath}
              element={
                <HydrateStates states={states}>
                  <CatchAll setLocation={setLocation} />
                  {children}
                </HydrateStates>
              }
            />
            <Route path='*' element={<CatchAll setLocation={setLocation} />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    </SWRConfig>
  )
}
