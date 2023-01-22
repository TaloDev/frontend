import { useState, useEffect } from 'react'
import classNames from 'classnames'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { focusStyle } from '../styles/theme'
import canViewPage from '../utils/canViewPage'
import { IconCaretDown, IconBolt, IconUser, IconFileExport, IconTrophy, IconKey, IconChartBar, IconExchange, IconSocial, IconSettings } from '@tabler/icons'
import LinkButton from './LinkButton'
import routes from '../constants/routes'
import userState from '../state/userState'
import { useRecoilValue } from 'recoil'
import Tippy from '@tippyjs/react'

function ServicesLink() {
  const user = useRecoilValue(userState)
  const [showServicesMenu, setShowServicesMenu] = useState(false)

  const location = useLocation()
  const [pathname, setPathname] = useState(location.pathname)

  useEffect(() => {
    setPathname(location.pathname)
  }, [showServicesMenu])

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
      route: routes.apiKeys
    },
    {
      name: 'Players',
      desc: 'See props, aliases and events',
      icon: IconUser,
      route: routes.players
    },
    {
      name: 'Groups',
      desc: 'Define rules for grouping players',
      icon: IconSocial,
      route: routes.groups
    },
    {
      name: 'Events',
      desc: 'Track and filter events',
      icon: IconBolt,
      route: routes.events
    },
    {
      name: 'Export',
      desc: 'Export your data',
      icon: IconFileExport,
      route: routes.dataExports
    },
    {
      name: 'Leaderboards',
      desc: 'Flexible highscore tracking',
      icon: IconTrophy,
      route: routes.leaderboards
    },
    {
      name: 'Stats',
      desc: 'Global and individual data',
      icon: IconChartBar,
      route: routes.stats
    },
    {
      name: 'Integrations',
      desc: 'Sync data with external services',
      icon: IconExchange,
      route: routes.integrations
    },
    {
      name: 'Live config',
      desc: 'Push state directly to your game',
      icon: IconSettings,
      route: routes.gameProps
    }
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
        content={(
          <ul className='mb-4 sm:min-w-[480px] grid sm:grid-cols-2 gap-2 bg-gray-800 border border-gray-700 p-2 rounded text-white transition-all'>
            {services.filter(({ route }) => canViewPage(user, route)).map(({ name, desc, icon: Icon, route }) => (
              <li key={name}>
                {showServicesMenu &&
                  <RouterLink to={route} className={classNames('group block p-4 rounded transition-colors hover:bg-gray-700 focus:bg-gray-700 space-y-2', focusStyle)}>
                    <p className='font-bold text-white group-hover:text-indigo-300 group-focus:text-indigo-300 text-sm md:text-base'>
                      <Icon size={16} className='inline-block mb-1 mr-1' />
                      {name}
                    </p>
                    <p className='text-gray-300 text-sm group-hover:text-white group-focus:text-white'>{desc}</p>
                  </RouterLink>
                }
              </li>
            ))}
          </ul>
        )}
      >
        <div>
          <LinkButton onClick={() => setShowServicesMenu(!showServicesMenu)}>
            <div className='flex sm:flex-row-reverse items-center'>
              Services
              <IconCaretDown size={20} className={classNames('ml-1 sm:ml-0 sm:mr-1 fill-current transform transition-transform', { 'rotate-180': showServicesMenu })} />
            </div>
          </LinkButton>
        </div>
      </Tippy>
    </li>
  )
}

export default ServicesLink
