// https://usehooks.com/useLocalStorage

import { useCallback, useState } from 'react'

export type SetLocalStorageValue<T> = (value: T | ((curr: T) => T)) => void

export default function useLocalStorage<T>(
  key: string | null,
  initialValue: T,
): [T, SetLocalStorageValue<T>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (key === null) {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        return JSON.parse(item) as T
      }
      window.localStorage.setItem(key, JSON.stringify(initialValue))
      return initialValue
    } catch (error) {
      console.error(error)
      window.localStorage.setItem(key, JSON.stringify(initialValue))
      return initialValue
    }
  })

  const setValue = useCallback<SetLocalStorageValue<T>>(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        if (key !== null) {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.error(error)
      }
    },
    [key, storedValue],
  )

  return [storedValue, setValue]
}
