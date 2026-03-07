import { ReactNode } from 'react'

export function UnauthedContainer({ children }: { children: ReactNode }) {
  return (
    <div className='flex h-full flex-col p-8 md:items-center md:justify-center'>{children}</div>
  )
}
