import { forwardRef } from 'react'

// eslint-disable-next-line @typescript-eslint/ban-types
export default function typedForwardRef<T, P = {}>(
  render: (props: P, ref: React.Ref<T>) => React.ReactNode
): (props: P & React.RefAttributes<T>) => React.ReactNode {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return forwardRef(render) as any
}
