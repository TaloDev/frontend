import React, { useMemo } from 'react'
import useGameActivities from '../api/useGameActivities'
import ErrorMessage from '../components/ErrorMessage'
import activeGameState from '../state/activeGameState'
import { useRecoilValue } from 'recoil'
import useSortedItems from '../utils/useSortedItems'
import { differenceInDays, subDays, startOfDay, isSameDay, format } from 'date-fns'
import SecondaryNav from '../components/SecondaryNav'
import { secondaryNavRoutes } from '../pages/Dashboard'
import Page from '../components/Page'
import SecondaryTitle from '../components/SecondaryTitle'

function Activity() {
  const activeGame = useRecoilValue(activeGameState)
  const { activities, loading, error } = useGameActivities(activeGame)

  const sortedActivities = useSortedItems(activities, 'createdAt')

  const sections = useMemo(() => {
    if (sortedActivities.length === 0) return []
    const latestDate = sortedActivities[0].createdAt
    const oldestDate = sortedActivities[sortedActivities.length - 1].createdAt

    const numSections = differenceInDays(new Date(latestDate), new Date(oldestDate)) + 1

    const sections = []
    for (let i = 0; i < numSections; i++) {
      const date = startOfDay(subDays(new Date(latestDate), i))
      sections.push({
        date,
        items: sortedActivities.filter((activity) => isSameDay(date, new Date(activity.createdAt)))
      })
    }

    return sections.filter((section) => section.items.length > 0)
  }, [sortedActivities])

  return (
    <Page
      title='Activity log'
      isLoading={loading}
      secondaryNav={<SecondaryNav routes={secondaryNavRoutes} />}
    >
      {!error && !loading && sections.length === 0 &&
        <p>{activeGame.name} doesn&apos;t have any activity yet</p>
      }

      {!error && sections.map((section, sectionIdx) => (
        <div key={sectionIdx} className='space-y-4'>
          <SecondaryTitle>{format(section.date, 'dd MMM Y')}</SecondaryTitle>

          {section.items.map((item, itemIdx) => (
            <div key={itemIdx} className='border-t border-gray-600 pt-4'>
              <p><span className='text-sm mr-2 text-indigo-300'>{format(new Date(item.createdAt), 'HH:mm')}</span> {item.description}</p>

              {item.extra &&
                <div className='-ml-2 flex flex-wrap'>
                  {Object.keys(item.extra).sort((a, b) => {
                    if (b === 'Player') return 1

                    return a.localeCompare(b)
                  }).map((key) => (
                    <code key={key} className='bg-gray-900 rounded p-2 text-xs md:text-sm ml-2 mt-2'>{key} = {item.extra[key]}</code>
                  ))}
                </div>
              }
            </div>
          ))}
        </div>
      ))}

      {error && <ErrorMessage error={error} />}
    </Page>
  )
}

export default Activity
