import { useEffect } from 'react'
import { RecoilState, useRecoilState } from 'recoil'

type RecoilObserverProps<T> = {
  node: RecoilState<T>
  onChange?: (value: T) => void
}

export default function RecoilObserver<T>({ node, onChange }: RecoilObserverProps<T>) {
  const [value] = useRecoilState(node)

  useEffect(() => {
    onChange?.(value)
  }, [onChange, value])

  return null
}
