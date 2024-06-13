import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import Button from '../components/Button'
import ErrorMessage from '../components/ErrorMessage'
import Page from '../components/Page'
import DateCell from '../components/tables/cells/DateCell'
import Table from '../components/tables/Table'
import TableBody from '../components/tables/TableBody'
import TableCell from '../components/tables/TableCell'
import activeGameState from '../state/activeGameState'
import useSortedItems from '../utils/useSortedItems'
import { IconPlus } from '@tabler/icons-react'
import routes from '../constants/routes'
import Link from '../components/Link'
import useFeedbackCategories from '../api/useFeedbackCategories'
import FeedbackCategoryDetails from '../modals/FeedbackCategoryDetails'

export default function FeedbackCategories() {
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  const activeGame = useRecoilValue(activeGameState)
  const { feedbackCategories, loading, error, mutate } = useFeedbackCategories(activeGame)

  const sortedFeedbackCategories = useSortedItems(feedbackCategories, 'internalName', 'asc')

  useEffect(() => {
    if (!showModal) setEditingCategory(null)
  }, [showModal, setEditingCategory])

  const onEditCategoryClick = (category) => {
    setEditingCategory(category)
    setShowModal(true)
  }

  return (
    <Page
      title='Feedback categories'
      extraTitleComponent={
        <div className='mt-1 ml-4 p-1 rounded-full bg-indigo-600'>
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
      <div className='!mt-2'>
        <Link to={routes.feedback}>Back to feedback</Link>
      </div>

      {!error && !loading && feedbackCategories.length === 0 &&
        <p>{activeGame.name} doesn&apos;t have any feedback categories yet</p>
      }

      {!error && feedbackCategories.length > 0 &&
        <Table columns={['Internal name', 'Display name', 'Anonymised', 'Created at', 'Updated at', '']}>
          <TableBody iterator={sortedFeedbackCategories}>
            {(feedbackCategory) => (
              <>
                <TableCell>{feedbackCategory.internalName}</TableCell>
                <TableCell className='min-w-[320px] max-w-[320px] lg:min-w-0'>
                  {feedbackCategory.name}
                  <div className='mt-2 text-sm'>
                    {feedbackCategory.description}
                  </div>
                </TableCell>
                <TableCell>{feedbackCategory.anonymised ? 'Yes' : 'No'}</TableCell>
                <DateCell>{format(new Date(feedbackCategory.createdAt), 'dd MMM Y, HH:mm')}</DateCell>
                <DateCell>{format(new Date(feedbackCategory.updatedAt), 'dd MMM Y, HH:mm')}</DateCell>
                <TableCell className='w-40'>
                  <Button variant='grey' onClick={() => onEditCategoryClick(feedbackCategory)}>Edit</Button>
                </TableCell>
              </>
            )}
          </TableBody>
        </Table>
      }

      {error && <ErrorMessage error={error} />}

      {showModal &&
        <FeedbackCategoryDetails
          modalState={[showModal, setShowModal]}
          mutate={mutate}
          editingCategory={editingCategory}
        />
      }
    </Page>
  )
}
