import {
  IconCaretDown,
  IconBolt,
  IconUser,
  IconFileExport,
  IconTrophy,
  IconKey,
  IconChartBar,
  IconExchange,
  IconSocial,
  IconSettings,
  IconMessages,
  IconBubbleText,
} from '@tabler/icons-react'
import Tippy from '@tippyjs/react'
import clsx from 'clsx'
import { useState, useEffect } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import routes from '../constants/routes'
import userState from '../state/userState'
import { focusStyle } from '../styles/theme'
import canViewPage from '../utils/canViewPage'
import LinkButton from './LinkButton'

function ServicesLink() {
  const user = useRecoilValue(userState)
  const [showServicesMenu, setShowServicesMenu] = useState(false)

  const location = useLocation()
  const [pathname, setPathname] = useState(location.pathname)

  useEffect(() => {
    setPathname(location.pathname)
  }, [location.pathname, showServicesMenu])

  useEffect(() => {
    if (location.pathname !== pathname) {
      setShowServicesMenu(false)
    }
  }, [location.pathname, pathname])

  const services = [
    {
      name: 'Access keys',
      desc: 'Manage and create keys',
      icon: IconKey,
      route: routes.apiKeys,
    },
    {
      name: 'Players',
      desc: 'See props, aliases and events',
      icon: IconUser,
      route: routes.players,
    },
    {
      name: 'Groups',
      desc: 'Define rules for grouping players',
      icon: IconSocial,
      route: routes.groups,
    },
    {
      name: 'Events',
      desc: 'Track and filter events',
      icon: IconBolt,
      route: routes.eventsOverview,
    },
    {
      name: 'Export',
      desc: 'Export your data',
      icon: IconFileExport,
      route: routes.dataExports,
    },
    {
      name: 'Leaderboards',
      desc: 'Flexible highscore tracking',
      icon: IconTrophy,
      route: routes.leaderboards,
    },
    {
      name: 'Stats',
      desc: 'Global and individual data',
      icon: IconChartBar,
      route: routes.stats,
    },
    {
      name: 'Integrations',
      desc: 'Sync data with external services',
      icon: IconExchange,
      route: routes.integrations,
    },
    {
      name: 'Live config',
      desc: 'Push state directly to your game',
      icon: IconSettings,
      route: routes.gameProps,
    },
    {
      name: 'Feedback',
      desc: 'Receive feedback from your players',
      icon: IconBubbleText,
      route: routes.feedback,
    },
    {
      name: 'Channels',
      desc: 'Manage channels and their storage pools',
      icon: IconMessages,
      route: routes.channels,
    },
  ]

  return (
    <li>
      <Tippy
        placement='bottom-start'
        visible={showServicesMenu}
        onClickOutside={() => setShowServicesMenu(false)}
        offset={[0, 10]}
        interactive={true}
        arrow={false}
        theme='services'
        maxWidth=''
        content={
          <ul className='mb-4 grid gap-2 rounded border border-gray-700 bg-gray-800 p-2 text-white transition-all sm:min-w-120 sm:grid-cols-2'>
            {services
              .filter(({ route }) => canViewPage(user, route))
              .map(({ name, desc, icon: Icon, route }) => (
                <li key={name}>
                  {showServicesMenu && (
                    <RouterLink
                      to={route}
                      className={clsx(
                        'group block space-y-2 rounded p-4 transition-colors hover:bg-gray-700 focus:bg-gray-700',
                        focusStyle,
                      )}
                    >
                      <p className='text-sm font-bold text-white group-hover:text-indigo-300 group-focus:text-indigo-300 md:text-base'>
                        <Icon size={16} className='mr-1 mb-1 inline-block' />
                        {name}
                      </p>
                      <p className='text-sm text-gray-300 group-hover:text-white group-focus:text-white'>
                        {desc}
                      </p>
                    </RouterLink>
                  )}
                </li>
              ))}
          </ul>
        }
      >
        <div>
          <LinkButton onClick={() => setShowServicesMenu(!showServicesMenu)}>
            <div className='flex items-center sm:flex-row-reverse'>
              Services
              <IconCaretDown
                size={20}
                className={clsx(
                  'ml-1 transform fill-current transition-transform sm:mr-1 sm:ml-0',
                  { 'rotate-180': showServicesMenu },
                )}
              />
            </div>
          </LinkButton>
        </div>
      </Tippy>
    </li>
  )
}

export default ServicesLink
