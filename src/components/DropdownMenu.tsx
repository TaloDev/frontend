import Tippy from '@tippyjs/react'
import { motion } from 'framer-motion'
import { ReactNode, useState } from 'react'
import Button from './Button'

type DropdownMenuProps = {
  options: {
    label: string
    onClick: () => void
  }[]
  children: (setOpen: (val: boolean) => void) => ReactNode
}

export default function DropdownMenu({ options, children }: DropdownMenuProps) {
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
        content={
          <motion.ul
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className='min-w-20 divide-y divide-gray-300 overflow-hidden rounded border border-gray-300 bg-white text-black shadow'
          >
            {options.map(({ label, onClick }) => {
              return (
                <li key={label} className='hover:bg-gray-100 focus:z-10 active:bg-gray-200'>
                  <Button
                    type='button'
                    variant='bare'
                    className='w-full truncate p-2'
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
        }
      >
        <div>{children(setOpen)}</div>
      </Tippy>
    </span>
  )
}
