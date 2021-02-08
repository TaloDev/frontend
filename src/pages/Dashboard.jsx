import React from 'react'
import { useRecoilValue } from 'recoil'
import activeGameState from '../state/activeGameState'
import userState from '../state/userState'

const Dashboard = () => {
  const user = useRecoilValue(userState)
  const activeGame = useRecoilValue(activeGameState)

  if (!activeGame) {
    return (
      <div>
        <h1 className='text-4xl font-bold'>Hey there</h1>
        <p className='mt-2'>Welcome to Talo! To get started, create a new game using the button in the top right</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className='text-4xl font-bold'>{activeGame.name} dashboard</h1>
      <p className='mt-2'>We last saw you {user?.lastSeenAt}</p>
    </div>
  )
}

export default Dashboard
