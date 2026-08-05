import { IconCheck, IconX } from '@tabler/icons-react'
import clsx from 'clsx'
import { useAtom } from 'jotai'
import { motion } from 'motion/react'
import { useState } from 'react'
import { devDataState } from '../../state/devDataState'
import { hiddenInputStyle, labelFocusStyle } from '../../styles/theme'

function DevDataToggle() {
  const [includeDevData, setIncludeDevData] = useAtom(devDataState)

  const [focus, setFocus] = useState(false)

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
        onChange={() => {
          setIncludeDevData(!includeDevData)
        }}
        checked={includeDevData}
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
            x: includeDevData ? 44 : 0,
            backgroundColor: includeDevData ? 'rgb(249,115,22)' : 'rgb(99,102,241)',
          }}
          initial={false}
          transition={{ duration: 0.2 }}
          className='relative h-full w-8 rounded-md'
        >
          <motion.span {...sharedIconProps} animate={{ opacity: includeDevData ? 1 : 0 }}>
            <IconCheck size={24} stroke={3} />
          </motion.span>

          <motion.span {...sharedIconProps} animate={{ opacity: includeDevData ? 0 : 1 }}>
            <IconX size={24} stroke={3} />
          </motion.span>
        </motion.div>
      </label>
    </>
  )
}

export default DevDataToggle
