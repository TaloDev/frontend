import clsx from 'clsx'
import { useLocation } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import userState from '../state/userState'
import canViewPage from '../utils/canViewPage'
import Link from './Link'

type SecondaryNavProps = {
  routes: {
    title: string
    to: string
  }[]
}

function SecondaryNav({ routes }: SecondaryNavProps) {
  const location = useLocation()
  const user = useRecoilValue(userState)

  const availableRoutes = routes.filter(({ to }) => canViewPage(user, to))
  if (availableRoutes.length < 2) return null

  return (
    <nav className='no-scrollbar -mx-4 -mt-4 mb-8 overflow-x-scroll border-b-2 border-b-gray-600 bg-gray-700 py-4 pr-12 pl-4 md:-mx-8 md:-mt-8 md:px-8'>
      <ul className='flex space-x-6 md:space-x-8'>
        {availableRoutes.map(({ title, to }) => {
          const active = location.pathname === to

          return (
            <li
              key={to}
              className={clsx(
                'relative shrink-0 after:absolute after:top-[38px] after:left-0 after:h-0.5 after:w-full after:content-[""]',
                {
                  'after:bg-white': active,
                  'hover:after:bg-indigo-300': !active,
                },
              )}
            >
              <Link
                to={to}
                className={clsx('no-underline!', {
                  'text-white!': active,
                  'text-indigo-300!': !active,
                })}
              >
                {title}
              </Link>
            </li>
          )
        })}
        <li className='w-6 md:hidden' />
      </ul>
    </nav>
  )
}

export default SecondaryNav
