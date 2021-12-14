import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { focusStyle } from '../styles/theme'
import canViewPage from '../utils/canViewPage'
import { IconCaretDown, IconBolt, IconUser, IconFileExport, IconTrophy, IconKey } from '@tabler/icons'
import LinkButton from './LinkButton'
import routes from '../constants/routes'
import userState from '../state/userState'
import { useRecoilValue } from 'recoil'

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
    }
  ]

  return (
    <li className='relative'>
      <LinkButton onClick={() => setShowServicesMenu(!showServicesMenu)}>
        <div className='flex sm:flex-row-reverse items-center'>
          Services
          <IconCaretDown size={20} className={classNames('ml-1 sm:ml-0 sm:mr-1 fill-current transform transition-transform', { 'rotate-180': showServicesMenu })} />
        </div>
      </LinkButton>

      <ul className={classNames('w-full sm:w-[480px] grid grid-cols-2 gap-2 absolute top-0 pointer-events-none opacity-0 bg-gray-800 border border-gray-700 p-2 rounded text-white transition-all', { '!top-10 z-50 opacity-100 filter drop-shadow-md !pointer-events-auto': showServicesMenu })}>
        {services.filter(({ route }) => canViewPage(user, route)).map(({ name, desc, icon: Icon, route }) => (
          <li key={name}>
            {showServicesMenu &&
              <RouterLink to={route} className={classNames('group block p-4 rounded transition-colors hover:bg-gray-700 focus:bg-gray-700 space-y-2', focusStyle)}>
                <p className='font-bold text-white group-hover:text-indigo-300 group-focus:text-indigo-300'>
                  <Icon size={18} className='inline-block mb-1 mr-1' />
                  {name}
                </p>
                <p className='text-gray-300 text-sm group-hover:text-white group-focus:text-white'>{desc}</p>
              </RouterLink>
            }
            {!showServicesMenu && <div className='h-[80px]' />}
          </li>
        ))}
      </ul>
    </li>
  )
}

export default ServicesLink
