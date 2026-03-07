import { ReactNode } from 'react'

export function UnauthedTitle({ children }: { children: ReactNode }) {
  return <h1 className='flex items-center space-x-4 font-mono text-4xl font-bold'>{children}</h1>
}
