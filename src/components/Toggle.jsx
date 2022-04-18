import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { motion } from 'framer-motion'
import { labelFocusStyle } from '../styles/theme'
import { IconCheck } from '@tabler/icons'

function Toggle({ id, enabled, onToggle }) {
  const [focus, setFocus] = useState(false)

  return (
    <>
      <input
        id={id}
        type='checkbox'
        className='absolute inset-0 opacity-0'
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={() => onToggle(!enabled)}
      />

      <label
        htmlFor={id}
        className={classNames('block h-12 w-24 p-2 bg-gray-900 border-2 border-gray-700 rounded-lg cursor-pointer', { [labelFocusStyle]: focus })}
      >
        <motion.div
          animate={{
            x: enabled ? 44 : 0,
            opacity: enabled ? 1 : 0.2
          }}
          initial={false}
          transition={{ duration: 0.2 }}
          className={classNames('bg-indigo-500 h-full w-8 rounded-md')}
        >
          {enabled &&
            <span className='flex items-center justify-center h-full'>
              <IconCheck size={24} stroke={3} />
            </span>
          }
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
