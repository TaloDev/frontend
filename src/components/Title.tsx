import type { ReactNode } from 'react'
import { IconArrowLeft } from '@tabler/icons-react'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import Button from './Button'

type TitleProps = {
  children: ReactNode
  showBackButton?: boolean
  className?: string
}

function Title({ children, showBackButton, className }: TitleProps) {
  const navigate = useNavigate()

  return (
    <header className={clsx('flex items-center', className)}>
      {showBackButton && (
        <Button
          variant='bare'
          className='mr-2 rounded-full bg-indigo-600 p-1'
          onClick={() => navigate(-1)}
          icon={<IconArrowLeft size={20} />}
          extra={{ 'aria-label': 'Go back' }}
        />
      )}

      <h1 className='text-3xl font-bold md:text-4xl'>{children}</h1>
    </header>
  )
}

export default Title
