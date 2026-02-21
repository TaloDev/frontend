import { IconCheck, IconX } from '@tabler/icons-react'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useRecoilState } from 'recoil'
import devDataState from '../../state/devDataState'
import { hiddenInputStyle, labelFocusStyle } from '../../styles/theme'

function DevDataToggle() {
  const [includeDevData, setIncludeDevData] = useRecoilState(devDataState)

  const [focus, setFocus] = useState(false)
  const [innerEnabled, setInnerEnabled] = useState(includeDevData)

  const sharedIconProps = {
    className: 'flex items-center justify-center h-full absolute left-0 right-0',
    initial: false,
    transition: { duration: 0.3 },
  }

  return (
    <>
      <input
        id='dev-data'
        type='checkbox'
        className={hiddenInputStyle}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={() => setInnerEnabled(!innerEnabled)}
        checked={innerEnabled}
      />

      <label
        htmlFor='dev-data'
        className={clsx(
          'block h-12 w-24 cursor-pointer rounded-lg border-2 border-gray-700 bg-gray-900 p-2',
          { [labelFocusStyle]: focus },
        )}
      >
        <motion.div
          animate={{
            x: innerEnabled ? 44 : 0,
            backgroundColor: innerEnabled ? 'rgb(249,115,22)' : 'rgb(99,102,241)',
          }}
          initial={false}
          transition={{ duration: 0.2 }}
          className='relative h-full w-8 rounded-md'
          onAnimationStart={() => {
            window.localStorage.setItem('includeDevDataOptimistic', String(innerEnabled))
          }}
          onAnimationComplete={() => {
            setIncludeDevData(innerEnabled)
          }}
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

export default DevDataToggle
