import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'

export default function RecoilObserver({ node, onChange }) {
  const [value] = useRecoilState(node)

  useEffect(() => {
    onChange?.(value)
  }, [onChange, value])

  return null
}

RecoilObserver.propTypes = {
  node: PropTypes.object.isRequired,
  onChange: PropTypes.func
}
