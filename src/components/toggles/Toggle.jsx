import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { motion } from 'framer-motion'
import { labelFocusStyle } from '../../styles/theme'

function Toggle({ id, enabled, onToggle, disabled, inputRef }) {
  const [focus, setFocus] = useState(false)
  const [innerEnabled, setInnerEnabled] = useState(enabled)

  const getBackgroundColour = () => {
    if (disabled) return '#d1d5db'
    return innerEnabled ? '#6366f1' : '#374151'
  }

  const getBorderColour = () => {
    if (disabled) return '#d1d5db'
    return innerEnabled ? '#818cf8' : '#4b5563'
  }

  return (
    <>
      <input
        id={id}
        data-testid={id}
        ref={inputRef}
        type='checkbox'
        className='absolute inset-0 opacity-0'
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={() => setInnerEnabled(!innerEnabled)}
        disabled={disabled}
        checked={enabled}
      />

      <motion.label
        htmlFor={id}
        className={classNames('block h-8 w-16 p-2 border-2 rounded-full cursor-pointer', { [labelFocusStyle]: focus, '!cursor-not-allowed': disabled })}
        animate={{
          backgroundColor: getBackgroundColour(),
          borderColor: getBorderColour()
        }}
        initial={false}
      >
        <motion.div
          animate={{
            y: -10,
            x: innerEnabled ? 22 : -10
          }}
          initial={false}
          transition={{ duration: 0.2 }}
          className='h-8 w-8 rounded-full relative shadow !bg-white border border-gray-200'
          onAnimationComplete={() => onToggle(innerEnabled)}
        />
      </motion.label>
    </>
  )
}

Toggle.propTypes = {
  id: PropTypes.string.isRequired,
  enabled: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  inputRef: PropTypes.func
}

export default Toggle
