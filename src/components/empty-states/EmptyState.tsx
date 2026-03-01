import { IconBook, IconExternalLink } from '@tabler/icons-react'
import { clsx } from 'clsx'
import { ReactNode, useCallback, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { DocsTypeSelection, DocType } from '../../modals/DocsTypeSelection'
import activeGameState, { SelectedActiveGame } from '../../state/activeGameState'
import useLocalStorage from '../../utils/useLocalStorage'
import Button from '../Button'

type Props = {
  title: ReactNode
  icon: ReactNode
  children: ReactNode
  learnMoreLink: string
  docs: {
    api: string
    godot: string
    unity: string
  }
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
  docs: Props['docs']
}) {
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  const [showModal, setShowModal] = useState(false)
  const [docsType, setDocsType] = useLocalStorage<DocType | null>(`${activeGame.id}-docsType`, null)

  const handleLearnMoreClick = useCallback(() => {
    window.open(learnMoreLink, '_blank')
  }, [learnMoreLink])

  const handleDocsClick = useCallback(() => {
    if (docsType) {
      window.open(docs[docsType], '_blank')
    } else {
      setShowModal(true)
    }
  }, [docs, docsType])

  const handleDocTypeSelected = useCallback(
    (selectedType: DocType) => {
      setDocsType(selectedType)
      setShowModal(false)
      window.open(docs[selectedType], '_blank')
    },
    [docs, setDocsType],
  )

  return (
    <>
      <div className={clsx('flex justify-center gap-4', className)}>
        <Button variant='grey' className='flex w-auto! gap-2' onClick={handleLearnMoreClick}>
          <IconExternalLink />
          <span>Learn more</span>
        </Button>
        <Button className='flex w-auto! gap-2' onClick={handleDocsClick}>
          <IconBook />
          <span>Go to docs</span>
        </Button>
      </div>
      {showModal && (
        <DocsTypeSelection
          modalState={[showModal, setShowModal]}
          onSelected={handleDocTypeSelected}
        />
      )}
    </>
  )
}

export function EmptyState({ title, icon, children, learnMoreLink, docs }: Props) {
  return (
    <div className='mx-auto my-20 flex flex-col items-center justify-center gap-4 text-center lg:mb-0 lg:w-1/2 xl:w-1/3'>
      <div className='flex size-16 items-center justify-center rounded-2xl border-2 border-indigo-400 bg-linear-to-b from-gray-800 to-gray-900 text-indigo-400 shadow-md'>
        {icon}
      </div>
      <EmptyStateTitle>{title}</EmptyStateTitle>
      <EmptyStateContent>{children}</EmptyStateContent>
      <EmptyStateButtons learnMoreLink={learnMoreLink} docs={docs} />
    </div>
  )
}
