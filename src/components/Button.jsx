import React from 'react'
import PropTypes from 'prop-types'
import { focusStyle } from '../styles/theme'
import Loading from './Loading'
import classNames from 'classnames'

const Button = (props) => {
  const className = classNames(`
    disabled:opacity-40
    disabled:cursor-not-allowed
    transition-colors
    ${focusStyle}
    ${props.className ?? ''}
  `, {
    'bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-800 disabled:bg-indigo-500 text-white': !props.variant,
    'px-4 py-2 w-full rounded font-semibold': [undefined, 'grey', 'red', 'green'].includes(props.variant),
    'bg-gray-200 hover:bg-gray-300 active:bg-gray-400 disabled:bg-gray-200 text-black': props.variant === 'grey',
    'bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-red-600 text-white': props.variant === 'red',
    'bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-green-600 text-white': props.variant === 'green',
    'text-left': props.variant === 'bare',
    'flex justify-center hover:bg-indigo-500': props.isLoading
  })

  return (
    <button
      disabled={props.disabled || props.isLoading}
      className={className}
      onClick={props.onClick}
    >
      {props.isLoading && <Loading size={24} thickness={180} />}
      {!props.isLoading && props.children}
    </button>
  )
}

Button.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.any.isRequired,
  onClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  variant: PropTypes.string,
  className: PropTypes.string
}

export default Button
