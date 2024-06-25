import type { ReactNode } from 'react'

type IdentifierProps = {
  id: string
  children?: ReactNode
}

export default function Identifier({
  id,
  children
}: IdentifierProps) {
  return (
    <div>
      <code className='bg-gray-900 rounded p-2 text-xs md:text-sm'>
        {children}
        {id}
      </code>
    </div>
  )
}
