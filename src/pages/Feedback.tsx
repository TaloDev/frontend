import { format } from 'date-fns'
import { useRecoilValue } from 'recoil'
import Button from '../components/Button'
import ErrorMessage from '../components/ErrorMessage'
import Page from '../components/Page'
import DateCell from '../components/tables/cells/DateCell'
import Table from '../components/tables/Table'
import TableBody from '../components/tables/TableBody'
import TableCell from '../components/tables/TableCell'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import useSortedItems from '../utils/useSortedItems'
import Select from '../components/Select'
import { useNavigate } from 'react-router-dom'
import routes from '../constants/routes'
import useFeedback from '../api/useFeedback'
import useFeedbackCategories from '../api/useFeedbackCategories'
import { IconArrowRight } from '@tabler/icons-react'
import clsx from 'clsx'
import { useState } from 'react'
import canViewPage from '../utils/canViewPage'
import userState from '../state/userState'
import Pagination from '../components/Pagination'
import TextInput from '../components/TextInput'
import useSearch from '../utils/useSearch'

export default function Feedback() {
  const user = useRecoilValue(userState)
  const activeGame = useRecoilValue(activeGameState) as SelectedActiveGame

  const [categoryInternalNameFilter, setCategoryInternalNameFilter] = useState<string | null>(null)
  const { search, setSearch, page, setPage, debouncedSearch } = useSearch()

  const {
    feedback,
    loading: feedbackLoading,
    count,
    itemsPerPage,
    error: feedbackError
  } = useFeedback(activeGame, categoryInternalNameFilter, debouncedSearch, page)
  const { feedbackCategories, loading: categoriesLoading, error: categoriesError } = useFeedbackCategories(activeGame)

  const sortedFeedback = useSortedItems(feedback, 'createdAt', 'asc')

  const navigate = useNavigate()

  const goToPlayer = (identifier: string) => {
    navigate(`${routes.players}?search=${identifier}`)
  }

  return (
    <Page
      title='Feedback'
      isLoading={feedbackLoading}
    >
      {!categoriesError &&
        <div className='space-y-4'>
          <div>
            <div className='flex items-center'>
              <div className='w-1/2 flex-grow md:flex-grow-0 md:w-[400px]'>
                <Select
                  inputId='sort-mode'
                  options={feedbackCategories.map((category) => ({ label: category.name, value: category.internalName, desc: category.description }))}
                  isLoading={categoriesLoading}
                  onChange={(option) => setCategoryInternalNameFilter(option?.value ?? null)}
                  placeholder='Filter by category'
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
          <div className='flex items-center'>
            <div className='w-1/2 flex-grow md:flex-grow-0 md:w-[400px]'>
              <TextInput
                id='feedback-search'
                placeholder='Search...'
                onChange={setSearch}
                value={search}
              />
            </div>
            {Boolean(count) && <span className='ml-4'>{count} {count === 1 ? 'comment' : 'comments'}</span>}
          </div>
        </div>
      }
      {categoriesError && <ErrorMessage error={categoriesError} />}

      {!feedbackError && !feedbackLoading && sortedFeedback.length === 0 &&
        <>
          {!categoryInternalNameFilter && debouncedSearch.length === 0 &&
            <p>{activeGame.name} doesn&apos;t have any feedback yet</p>
          }
          {(categoryInternalNameFilter || debouncedSearch.length > 0) &&
            <p>No feedback matches your query</p>
          }
        </>
      }

      {!feedbackError && sortedFeedback.length > 0 &&
        <>
          <Table columns={['Submitted at', 'Category', 'Comment', 'Player']}>
            <TableBody
              iterator={sortedFeedback}
              configureClassnames={(feedback, idx) => ({
                'bg-orange-600': feedback.devBuild && idx % 2 !== 0,
                'bg-orange-500': feedback.devBuild && idx % 2 === 0
              })}
            >
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
                          onClick={() => goToPlayer(feedback.playerAlias!.identifier)}
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

          {Boolean(count) && <Pagination count={count!} pageState={[page, setPage]} itemsPerPage={itemsPerPage!} />}
        </>
      }

      {feedbackError && <ErrorMessage error={feedbackError} />}
    </Page>
  )
}
