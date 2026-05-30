import { ReactNode, useCallback, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { DocsTypeSelection, DocType } from '../modals/DocsTypeSelection'
import activeGameState from '../state/activeGameState'
import useLocalStorage from './useLocalStorage'

export function useDocsSelection(docs: Record<DocType, string>): {
  openDocs: () => void
  modalElement: ReactNode
} {
  const activeGame = useRecoilValue(activeGameState)
  const storageKey = activeGame ? `${activeGame.id}-docsType` : null

  const [showModal, setShowModal] = useState(false)
  const [storedType, setDocsType] = useLocalStorage<DocType | null>(storageKey, null)
  const docsType = storedType

  const openDocs = useCallback(() => {
    if (docsType && storageKey) {
      window.open(docs[docsType], '_blank')
    } else {
      setShowModal(true)
    }
  }, [docs, docsType, storageKey])

  const handleDocTypeSelected = useCallback(
    (selectedType: DocType) => {
      if (storageKey) {
        setDocsType(selectedType)
      }
      setShowModal(false)
      window.open(docs[selectedType], '_blank')
    },
    [docs, storageKey, setDocsType],
  )

  const modalElement = showModal ? (
    <DocsTypeSelection modalState={[showModal, setShowModal]} onSelected={handleDocTypeSelected} />
  ) : null

  return { openDocs, modalElement }
}
