import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { motion } from 'framer-motion'
import { labelFocusStyle } from '../../styles/theme'

function Toggle({ id, enabled, onToggle }) {
  const [focus, setFocus] = useState(false)
  const [innerEnabled, setInnerEnabled] = useState(enabled)

  return (
    <>
      <input
        id={id}
        type='checkbox'
        className='absolute inset-0 opacity-0'
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={() => setInnerEnabled(!innerEnabled)}
      />

      <motion.label
        htmlFor={id}
        className={classNames('block h-8 w-16 p-2 border-2 rounded-full cursor-pointer', { [labelFocusStyle]: focus })}
        animate={{
          backgroundColor: innerEnabled ? '#6366f1' : '#374151',
          borderColor: innerEnabled ? '#818cf8' : '#4b5563'
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
          className='h-8 w-8 rounded-full relative shadow !bg-white'
          onAnimationComplete={() => onToggle(innerEnabled)}
        />
      </motion.label>
    </>
  )
}

Toggle.propTypes = {
  id: PropTypes.string.isRequired,
  enabled: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
}

export default Toggle
