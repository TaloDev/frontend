import { IconBook, IconExternalLink } from '@tabler/icons-react'
import { clsx } from 'clsx'
import { ReactNode, useCallback } from 'react'
import { useDocsSelection } from '../../utils/useDocsSelection'
import Button from '../Button'

type Props = {
  title: ReactNode
  icon: ReactNode
  children: ReactNode
  learnMoreLink?: string
  docs?: {
    api: string
    godot: string
    unity: string
  }
}

export function EmptyStateContainer({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={clsx(
        'mx-auto my-20 flex flex-col items-center justify-center gap-4 text-center lg:mb-0 lg:w-1/2 xl:w-1/3',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function EmptyStateIcon({ icon, className }: { icon: ReactNode; className?: string }) {
  return (
    <div
      className={clsx(
        'flex size-16 items-center justify-center rounded-2xl border-2 border-indigo-400 bg-linear-to-b from-gray-800 to-gray-900 text-indigo-400 shadow-md',
        className,
      )}
    >
      {icon}
    </div>
  )
}

export function EmptyStateTitle({ children }: { children: ReactNode }) {
  return <p className='text-xl font-medium'>{children}</p>
}

export function EmptyStateContent({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return <div className={clsx('leading-relaxed text-gray-300', className)}>{children}</div>
}

export function EmptyStateButtons({
  className,
  learnMoreLink,
  docs,
}: {
  className?: string
  learnMoreLink: Props['learnMoreLink']
  docs: NonNullable<Props['docs']>
}) {
  const { openDocs, modalElement } = useDocsSelection(docs)

  const handleLearnMoreClick = useCallback(() => {
    window.open(learnMoreLink, '_blank')
  }, [learnMoreLink])

  return (
    <>
      <div className={clsx('flex justify-center gap-4', className)}>
        <Button variant='grey' className='flex w-auto! gap-2' onClick={handleLearnMoreClick}>
          <IconExternalLink />
          <span>Learn more</span>
        </Button>
        <Button className='flex w-auto! gap-2' onClick={openDocs}>
          <IconBook />
          <span>Go to docs</span>
        </Button>
      </div>
      {modalElement}
    </>
  )
}

export function EmptyState({ title, icon, children, learnMoreLink, docs }: Props) {
  return (
    <EmptyStateContainer>
      <EmptyStateIcon icon={icon} />
      <EmptyStateTitle>{title}</EmptyStateTitle>
      <EmptyStateContent>{children}</EmptyStateContent>
      {learnMoreLink && docs && <EmptyStateButtons learnMoreLink={learnMoreLink} docs={docs} />}
    </EmptyStateContainer>
  )
}
