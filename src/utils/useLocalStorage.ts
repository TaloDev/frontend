// https://usehooks.com/useLocalStorage

import { useCallback, useState } from 'react'

export type SetLocalStorageValue<T> = (value: T | ((curr: T) => T)) => void

export default function useLocalStorage<T>(key: string, initialValue: T): [T, SetLocalStorageValue<T>] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key)
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) as T : initialValue
    } catch (error) {
      // If error also return initialValue
      console.error(error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that persists the new value to localStorage.
  const setValue = useCallback<SetLocalStorageValue<T>>((value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      // Save state
      setStoredValue(valueToStore)
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(error)
    }
  }, [key, storedValue])

  return [storedValue, setValue]
}
