import { useState } from 'react'
import classNames from 'classnames'
import { motion } from 'framer-motion'
import { hiddenInputStyle, labelFocusStyle } from '../../styles/theme'
import { IconCheck, IconX } from '@tabler/icons-react'
import { useRecoilState } from 'recoil'
import devDataState from '../../state/devDataState'

function DevDataToggle() {
  const [includeDevData, setIncludeDevData] = useRecoilState(devDataState)

  const [focus, setFocus] = useState(false)
  const [innerEnabled, setInnerEnabled] = useState(includeDevData)

  const sharedIconProps = {
    className:'flex items-center justify-center h-full absolute left-0 right-0',
    initial: false,
    transition: { duration: 0.3 }
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
        className={classNames('block h-12 w-24 p-2 bg-gray-900 border-2 border-gray-700 rounded-lg cursor-pointer', { [labelFocusStyle]: focus })}
      >
        <motion.div
          animate={{
            x: innerEnabled ? 44 : 0,
            backgroundColor: innerEnabled ? 'rgb(249,115,22)' : 'rgb(99,102,241)'
          }}
          initial={false}
          transition={{ duration: 0.2 }}
          className='h-full w-8 rounded-md relative'
          onAnimationStart={() => setIncludeDevData(innerEnabled)}
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
