import { useRecoilValue } from 'recoil'
import userState from '../atoms/userState'

const Dashboard = () => {
  const user = useRecoilValue(userState)

  return (
    <div>
      <h1 className='text-4xl font-bold'>Hey there</h1>
      <p>We last saw you {user?.lastSeenAt}</p>
    </div>
  )
}

export default Dashboard
