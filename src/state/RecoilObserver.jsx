import React from 'react'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'

export default function RecoilObserver({ node, onChange, initialValue, children }) {
  const [value, setValue] = useRecoilState(node)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (initialValue !== undefined) {
      setValue(initialValue)
    } else {
      setReady(true)
    }
  }, [])

  useEffect(() => {
    if (value === initialValue) setReady(true)
  }, [value, initialValue])

  useEffect(() => onChange?.(value), [onChange, value])

  if (!ready) return <div>Loading</div>

  return children
}

RecoilObserver.propTypes = {
  node: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  initialValue: PropTypes.any,
  children: PropTypes.node
}
