import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { motion } from 'framer-motion'
import { labelFocusStyle } from '../styles/theme'
import { IconCheck, IconX } from '@tabler/icons'

function Toggle({ id, enabled, onToggle }) {
  const [focus, setFocus] = useState(false)
  const [innerEnabled, setInnerEnabled] = useState(enabled)

  const sharedIconProps = {
    className:'flex items-center justify-center h-full absolute left-0 right-0',
    initial: false,
    transition: { duration: 0.3 }
  }

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

      <label
        htmlFor={id}
        className={classNames('block h-12 w-24 p-2 bg-gray-900 border-2 border-gray-700 rounded-lg cursor-pointer', { [labelFocusStyle]: focus })}
      >
        <motion.div
          animate={{
            x: innerEnabled ? 44 : 0,
            backgroundColor: innerEnabled ? 'rgb(251,146,60)' : 'rgb(99,102,241)'
          }}
          initial={false}
          transition={{ duration: 0.2 }}
          className='h-full w-8 rounded-md relative'
          onAnimationComplete={() => onToggle(innerEnabled)}
        >
          <motion.span {...sharedIconProps} animate={{ opacity: innerEnabled ? 1 : 0 }}>
            <IconCheck size={24} stroke={3} />
          </motion.span>

          <motion.span {...sharedIconProps} animate={{ opacity: innerEnabled ? 0 : 1 }}>
            <IconX size={24} stroke={3} />
          </motion.span>
        </motion.div>
      </label>
    </>
  )
}

Toggle.propTypes = {
  id: PropTypes.string.isRequired,
  enabled: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
}

export default Toggle
