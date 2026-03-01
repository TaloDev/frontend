import { IconArrowRight, IconCrosshair } from '@tabler/icons-react'
import clsx from 'clsx'
import { format } from 'date-fns'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import useFeedback from '../api/useFeedback'
import useFeedbackCategories from '../api/useFeedbackCategories'
import Button from '../components/Button'
import { NoFeedback } from '../components/empty-states/NoFeedback'
import ErrorMessage from '../components/ErrorMessage'
import Page from '../components/Page'
import Pagination from '../components/Pagination'
import { PropBadges } from '../components/PropBadges'
import Select from '../components/Select'
import DateCell from '../components/tables/cells/DateCell'
import Table from '../components/tables/Table'
import TableBody from '../components/tables/TableBody'
import TableCell from '../components/tables/TableCell'
import TextInput from '../components/TextInput'
import routes from '../constants/routes'
import { Prop } from '../entities/prop'
import activeGameState, { SelectedActiveGame } from '../state/activeGameState'
import userState from '../state/userState'
import canViewPage from '../utils/canViewPage'
import useSearch from '../utils/useSearch'
import useSortedItems from '../utils/useSortedItems'

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
    error: feedbackError,
  } = useFeedback(activeGame, categoryInternalNameFilter, debouncedSearch, page)
  const {
    feedbackCategories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useFeedbackCategories(activeGame)

  const sortedFeedback = useSortedItems(feedback, 'createdAt')

  const navigate = useNavigate()

  const goToPlayer = useCallback(
    (identifier: string) => {
      navigate(`${routes.players}?search=${identifier}`)
    },
    [navigate],
  )

  const setPropSearch = useCallback(
    (prop: Prop) => {
      window.scrollTo(0, 0)
      setSearch(`prop:${prop.key}=${prop.value}`)
    },
    [setSearch],
  )

  return (
    <Page title='Feedback' isLoading={feedbackLoading}>
      {!categoriesError && (
        <div className='space-y-4'>
          <div>
            <div className='flex items-center'>
              <div className='w-1/2 grow md:w-100 md:grow-0'>
                <Select
                  inputId='sort-mode'
                  options={feedbackCategories.map((category) => ({
                    label: category.name,
                    value: category.internalName,
                    desc: category.description,
                  }))}
                  isLoading={categoriesLoading}
                  onChange={(option) => setCategoryInternalNameFilter(option?.value ?? null)}
                  placeholder='Filter by category'
                  isClearable
                />
              </div>

              {canViewPage(user, routes.feedbackCategories) && (
                <Button
                  onClick={() => navigate(routes.feedbackCategories)}
                  className='ml-4 w-auto!'
                >
                  Edit categories
                </Button>
              )}
            </div>
          </div>
          <div className='flex items-center'>
            <div className='w-1/2 grow md:w-100 md:grow-0'>
              <TextInput
                id='feedback-search'
                type='search'
                placeholder='Search by comment, player or props...'
                onChange={setSearch}
                value={search}
              />
            </div>
            {Boolean(count) && (
              <span className='ml-4'>
                {count} {count === 1 ? 'comment' : 'comments'}
              </span>
            )}
          </div>
        </div>
      )}
      {categoriesError && <ErrorMessage error={categoriesError} />}

      {!feedbackError && !feedbackLoading && sortedFeedback.length === 0 && (
        <>
          {!categoryInternalNameFilter && debouncedSearch.length === 0 && <NoFeedback />}
          {(categoryInternalNameFilter || debouncedSearch.length > 0) && (
            <p>No feedback matches your query</p>
          )}
        </>
      )}

      {!feedbackError && sortedFeedback.length > 0 && (
        <>
          <Table columns={['Submitted at', 'Category', 'Comment', 'Props', 'Player']}>
            <TableBody
              iterator={sortedFeedback}
              configureClassnames={(feedback, idx) => ({
                'bg-orange-600': feedback.devBuild && idx % 2 !== 0,
                'bg-orange-500': feedback.devBuild && idx % 2 === 0,
              })}
            >
              {(feedback) => (
                <>
                  <DateCell>{format(new Date(feedback.createdAt), 'dd MMM yyyy, HH:mm')}</DateCell>
                  <TableCell>{feedback.category.name}</TableCell>
                  <TableCell className='w-100 whitespace-pre-wrap'>{feedback.comment}</TableCell>
                  <TableCell className='w-100'>
                    <PropBadges
                      props={feedback.props}
                      className='flex flex-col'
                      devBuild={feedback.devBuild}
                      icon={<IconCrosshair size={20} />}
                      onClick={setPropSearch}
                      buttonTitle='Filter by this prop'
                    />
                  </TableCell>
                  <TableCell>
                    {feedback.playerAlias && (
                      <div className='flex items-center'>
                        <span>{feedback.playerAlias.identifier}</span>
                        <Button
                          variant='icon'
                          className={clsx('ml-2 rounded-full bg-indigo-900 p-1', {
                            'bg-orange-900': feedback.playerAlias.player.devBuild,
                          })}
                          onClick={() => goToPlayer(feedback.playerAlias!.identifier)}
                          icon={<IconArrowRight size={16} />}
                        />
                      </div>
                    )}
                    {!feedback.playerAlias && 'Anonymous'}
                  </TableCell>
                </>
              )}
            </TableBody>
          </Table>

          {Boolean(count) && (
            <Pagination count={count!} pageState={[page, setPage]} itemsPerPage={itemsPerPage!} />
          )}
        </>
      )}

      {feedbackError && <ErrorMessage error={feedbackError} />}
    </Page>
  )
}
