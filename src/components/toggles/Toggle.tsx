import { Ref, useState } from 'react'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { hiddenInputStyle, labelFocusStyle } from '../../styles/theme'

type ToggleProps = {
  id: string
  enabled: boolean
  onToggle: (toggled: boolean) => void
  disabled?: boolean
  inputRef?: Ref<HTMLInputElement>
}

function Toggle({
  id,
  enabled,
  onToggle,
  disabled,
  inputRef
}: ToggleProps) {
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
        className={hiddenInputStyle}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={() => setInnerEnabled(!innerEnabled)}
        disabled={disabled}
        checked={innerEnabled}
      />

      <motion.label
        htmlFor={id}
        className={clsx('block h-8 w-16 p-2 border-2 rounded-full cursor-pointer', { [labelFocusStyle]: focus, '!cursor-not-allowed': disabled })}
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
          onAnimationStart={() => onToggle(innerEnabled)}
        />
      </motion.label>
    </>
  )
}

export default Toggle
