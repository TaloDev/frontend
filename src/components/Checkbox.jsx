import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { IconCheck } from '@tabler/icons'
import { focusStyle } from '../styles/theme'

export default function Checkbox({ id, checked, onChange, labelContent, inputRef }) {
  return (
    <div>
      <span className='relative'>
        <input
          id={id}
          ref={inputRef}
          className={classNames(focusStyle, 'peer appearance-none align-text-top h-[20px] w-[20px] rounded-sm border border-gray-500 checked:border-indigo-400 bg-gray-600 checked:bg-indigo-500')}
          type='checkbox'
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <IconCheck size={16} stroke={3} className='hidden peer-checked:inline absolute left-[1.5px] top-[2px] pointer-events-none' />
      </span>


      <label htmlFor={id} className='ml-2'>{labelContent}</label>
    </div>
  )
}

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  labelContent: PropTypes.node.isRequired,
  inputRef: PropTypes.func
}
