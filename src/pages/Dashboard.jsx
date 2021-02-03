import React from 'react'
import { useRecoilValue } from 'recoil'
import activeGameState from '../state/activeGameState'
import userState from '../state/userState'

const Dashboard = () => {
  const user = useRecoilValue(userState)
  const activeGame = useRecoilValue(activeGameState)

  return (
    <div>
      <h1 className='text-4xl font-bold'>{activeGame?.name} dashboard</h1>
      <p className='mt-2'>We last saw you {user?.lastSeenAt}</p>
    </div>
  )
}

export default Dashboard
