import { format } from 'date-fns'
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
import Select from '../components/Select'
import { useNavigate } from 'react-router-dom'
import routes from '../constants/routes'
import useFeedback from '../api/useFeedback'
import useFeedbackCategories from '../api/useFeedbackCategories'
import { IconArrowRight } from '@tabler/icons-react'
import clsx from 'clsx'
import { useMemo, useState } from 'react'
import canViewPage from '../utils/canViewPage'
import userState from '../state/userState'

export default function Feedback() {
  const user = useRecoilValue(userState)
  const activeGame = useRecoilValue(activeGameState)

  const [categoryInternalNameFilter, setCategoryInternalNameFilter] = useState(null)
  const { feedback, loading: feedbackLoading, error: feedbackError } = useFeedback(activeGame, categoryInternalNameFilter)
  const { feedbackCategories, loading: categoriesLoading, error: categoriesError } = useFeedbackCategories(activeGame)

  const sortedFeedback = useSortedItems(feedback, 'createdAt', 'asc')

  const navigate = useNavigate()

  const goToPlayer = (identifier) => {
    navigate(`${routes.players}?search=${identifier}`)
  }

  const categoryFromFilter = useMemo(() => {
    if (!categoryInternalNameFilter) return null
    return feedbackCategories.find((category) => category.internalName === categoryInternalNameFilter)
  }, [categoryInternalNameFilter, feedbackCategories])

  return (
    <Page
      title='Feedback'
      isLoading={feedbackLoading}
    >
      {!categoriesError &&
        <div>
          <label htmlFor='sort-mode' className='block font-semibold'>Filter by category</label>

          <div className='flex items-center mt-1'>
            <div className='md:w-[400px]'>
              <Select
                inputId='sort-mode'
                options={feedbackCategories.map((category) => ({ label: category.name, value: category.internalName, desc: category.description }))}
                loading={categoriesLoading}
                onChange={(option) => setCategoryInternalNameFilter(option?.value ?? null)}
                isClearable
              />
            </div>

            {canViewPage(user, routes.feedbackCategories) &&
              <Button
                onClick={() => navigate(routes.feedbackCategories)}
                className='ml-4 !w-auto'
              >
                Edit categories
              </Button>
            }
          </div>
        </div>
      }
      {categoriesError && <ErrorMessage error={categoriesError} />}

      {!feedbackError && !feedbackLoading && sortedFeedback.length === 0 &&
        <>
          {categoryInternalNameFilter && <p>{activeGame.name} doesn&apos;t have any feedback in the {categoryFromFilter.name} category yet</p>}
          {!categoryInternalNameFilter && <p>{activeGame.name} doesn&apos;t have any feedback yet</p>}
        </>
      }

      {!feedbackError && sortedFeedback.length > 0 &&
        <Table columns={['Submitted at', 'Category', 'Comment', 'Player']}>
          <TableBody iterator={sortedFeedback}>
            {(feedback) => (
              <>
                <DateCell>{format(new Date(feedback.createdAt), 'dd MMM Y, HH:mm')}</DateCell>
                <TableCell>{feedback.category.name}</TableCell>
                <TableCell className='min-w-[320px] max-w-[320px]'>{feedback.comment}</TableCell>
                <TableCell>
                  {feedback.playerAlias &&
                    <div className='flex items-center'>
                      <span>{feedback.playerAlias.identifier}</span>
                      <Button
                        variant='icon'
                        className={clsx('ml-2 p-1 rounded-full bg-indigo-900', { 'bg-orange-900': feedback.playerAlias.player.devBuild })}
                        onClick={() => goToPlayer(feedback.playerAlias.identifier)}
                        icon={<IconArrowRight size={16} />}
                      />
                    </div>
                  }
                  {!feedback.playerAlias && 'Anonymous'}
                </TableCell>
              </>
            )}
          </TableBody>
        </Table>
      }

      {feedbackError && <ErrorMessage error={feedbackError} />}
    </Page>
  )
}
