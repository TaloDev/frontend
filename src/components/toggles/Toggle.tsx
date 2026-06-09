import clsx from 'clsx'
import { motion } from 'framer-motion'
import { Ref, useState } from 'react'
import { hiddenInputStyle, labelFocusStyle } from '../../styles/theme'

type ToggleProps = {
  id: string
  className?: string
  enabled: boolean
  onToggle: (toggled: boolean) => void
  disabled?: boolean
  small?: boolean
  colour?: string
  borderColour?: string
  inputRef?: Ref<HTMLInputElement>
  evaluateToggle?: (newValue: boolean) => boolean
}

function Toggle({
  id,
  className,
  enabled,
  onToggle,
  disabled,
  small,
  colour = '#6366f1',
  borderColour = '#818cf8',
  inputRef,
  evaluateToggle,
}: ToggleProps) {
  const [focus, setFocus] = useState(false)
  const [innerEnabled, setInnerEnabled] = useState(enabled)

  const getBackgroundColour = () => {
    if (disabled) return '#9ca3af'
    return innerEnabled ? colour : '#374151'
  }

  const getBorderColour = () => {
    if (disabled) return '#9ca3af'
    return innerEnabled ? borderColour : '#4b5563'
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
        onChange={() => {
          const newValue = !innerEnabled
          if (evaluateToggle?.(newValue) ?? true) {
            setInnerEnabled(newValue)
          }
        }}
        disabled={disabled}
        checked={innerEnabled}
      />

      <motion.label
        htmlFor={id}
        className={clsx(
          'block cursor-pointer rounded-full border-2',
          {
            'h-8 w-16 p-2': !small,
            'h-5 w-10 p-1': small,
            [labelFocusStyle]: focus,
            'cursor-not-allowed!': disabled,
          },
          className,
        )}
        animate={{
          backgroundColor: getBackgroundColour(),
          borderColor: getBorderColour(),
        }}
        initial={false}
      >
        <motion.div
          animate={{
            y: small ? -6 : -10,
            x: innerEnabled ? (small ? 14 : 22) : small ? -6 : -10,
          }}
          initial={false}
          transition={{ duration: 0.2 }}
          className={clsx('relative rounded-full border border-gray-200 bg-white! shadow', {
            'h-8 w-8': !small,
            'h-5 w-5': small,
          })}
          onAnimationStart={() => onToggle(innerEnabled)}
        />
      </motion.label>
    </>
  )
}

export default Toggle
