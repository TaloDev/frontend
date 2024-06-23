import { IconArrowLeft } from '@tabler/icons-react'
import Button from './Button'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import type { ReactNode } from 'react'

type TitleProps = {
  children: ReactNode
  showBackButton?: boolean
  className?: string
}

function Title({
  children,
  showBackButton,
  className
}: TitleProps) {
  const navigate = useNavigate()

  return (
    <header className={clsx('flex items-center', className)}>
      {showBackButton &&
        <Button
          variant='bare'
          className='mr-2 bg-indigo-600 rounded-full p-1'
          onClick={() => navigate(-1)}
          icon={<IconArrowLeft size={20} />}
          extra={{ 'aria-label': 'Go back' }}
        />
      }

      <h1 className='text-3xl md:text-4xl font-bold'>{children}</h1>
    </header>
  )
}

export default Title
