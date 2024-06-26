import { ReactNode, useState } from 'react'
import { motion } from 'framer-motion'
import Button from './Button'
import Tippy from '@tippyjs/react'

type DropdownMenuProps = {
  options: {
    label: string
    onClick: () => void
  }[]
  children: (setOpen: (val: boolean) => void) => ReactNode
}

export default function DropdownMenu({
  options,
  children
}: DropdownMenuProps) {
  const [isOpen, setOpen] = useState(false)

  return (
    <span>
      <Tippy
        placement='bottom-start'
        visible={isOpen}
        onClickOutside={/* v8ignore next */ () => setOpen(false)}
        offset={[0, 8]}
        interactive={true}
        arrow={false}
        theme='bare'
        content={(
          <motion.ul
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className='bg-white text-black rounded overflow-hidden min-w-20 divide-y divide-gray-300 border border-gray-300 shadow'
          >
            {options.map(({ label, onClick }) => {
              return (
                <li key={label} className='hover:bg-gray-100 active:bg-gray-200 focus:z-10'>
                  <Button
                    type='button'
                    variant='bare'
                    className='truncate p-2 w-full'
                    onClick={() => {
                      onClick()
                      setOpen(false)
                    }}
                  >
                    {label}
                  </Button>
                </li>
              )
            })}
          </motion.ul>
        )}
      >
        <div>
          {children(setOpen)}
        </div>
      </Tippy>
    </span>
  )
}
