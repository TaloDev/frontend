import { IconPlus } from '@tabler/icons-react'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import useFeedbackCategories from '../api/useFeedbackCategories'
import Button from '../components/Button'
import ErrorMessage from '../components/ErrorMessage'
import Page from '../components/Page'
import DateCell from '../components/tables/cells/DateCell'
import Table from '../components/tables/Table'
import TableBody from '../components/tables/TableBody'
import TableCell from '../components/tables/TableCell'
import { GameFeedbackCategory } from '../entities/gameFeedbackCategory'
import FeedbackCategoryDetails from '../modals/FeedbackCategoryDetails'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import useSortedItems from '../utils/useSortedItems'

export default function FeedbackCategories() {
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<GameFeedbackCategory | null>(null)

  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame
  const { feedbackCategories, loading, error, mutate } = useFeedbackCategories(activeGame)

  const sortedFeedbackCategories = useSortedItems(feedbackCategories, 'internalName', 'asc')

  useEffect(() => {
    if (!showModal) setEditingCategory(null)
  }, [showModal, setEditingCategory])

  const onEditCategoryClick = (category: GameFeedbackCategory) => {
    setEditingCategory(category)
    setShowModal(true)
  }

  return (
    <Page
      showBackButton
      title='Feedback categories'
      extraTitleComponent={
        <div className='mt-1 ml-4 rounded-full bg-indigo-600 p-1'>
          <Button
            variant='icon'
            onClick={() => setShowModal(true)}
            icon={<IconPlus />}
            extra={{ 'aria-label': 'Create category' }}
          />
        </div>
      }
      isLoading={loading}
    >
      {!error && !loading && feedbackCategories.length === 0 && (
        <p>{activeGame.name} doesn&apos;t have any feedback categories yet</p>
      )}

      {!error && feedbackCategories.length > 0 && (
        <Table
          columns={['Internal name', 'Display name', 'Anonymised', 'Created at', 'Updated at', '']}
        >
          <TableBody iterator={sortedFeedbackCategories}>
            {(feedbackCategory) => (
              <>
                <TableCell>{feedbackCategory.internalName}</TableCell>
                <TableCell className='max-w-[320px] min-w-[320px] lg:min-w-0'>
                  {feedbackCategory.name}
                  <div className='mt-2 text-sm'>{feedbackCategory.description}</div>
                </TableCell>
                <TableCell>{feedbackCategory.anonymised ? 'Yes' : 'No'}</TableCell>
                <DateCell>
                  {format(new Date(feedbackCategory.createdAt), 'dd MMM yyyy, HH:mm')}
                </DateCell>
                <DateCell>
                  {format(new Date(feedbackCategory.updatedAt), 'dd MMM yyyy, HH:mm')}
                </DateCell>
                <TableCell className='w-40'>
                  <Button variant='grey' onClick={() => onEditCategoryClick(feedbackCategory)}>
                    Edit
                  </Button>
                </TableCell>
              </>
            )}
          </TableBody>
        </Table>
      )}

      {error && <ErrorMessage error={error} />}

      {showModal && (
        <FeedbackCategoryDetails
          modalState={[showModal, setShowModal]}
          mutate={mutate}
          editingCategory={editingCategory}
        />
      )}
    </Page>
  )
}
