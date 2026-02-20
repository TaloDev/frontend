import { IconCheck } from '@tabler/icons-react'
import { MouseEvent, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import Account2FA from '../components/Account2FA'
import AlertBanner from '../components/AlertBanner'
import Button from '../components/Button'
import Page from '../components/Page'
import TextInput from '../components/TextInput'
import routes from '../constants/routes'
import userState, { AuthedUser } from '../state/userState'
import { ConfirmPasswordAction } from './ConfirmPassword'

export default function Account() {
  const navigate = useNavigate()
  const location = useLocation()

  const user = useRecoilValue(userState) as AuthedUser

  const [successMessage] = useState(location.state?.successMessage)

  const [newPassword, setNewPassword] = useState('')

  const onChangePasswordClick = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()

    navigate(routes.confirmPassword, {
      state: {
        onConfirmAction: ConfirmPasswordAction.CHANGE_PASSWORD,
        newPassword,
      },
    })
  }

  return (
    <Page title={user.username} containerClassName='w-full lg:2/3 xl:w-1/2'>
      <h2 className='text-xl'>{user.email}</h2>

      {successMessage && (
        <AlertBanner className='bg-green-600' icon={IconCheck} text={successMessage} />
      )}

      <div className='rounded-md bg-gray-900 p-4 md:p-8'>
        <Account2FA />
      </div>

      <form className='space-y-4 rounded-md bg-gray-900 p-4 md:p-8'>
        <h2 className='text-xl font-bold lg:text-2xl'>Change password</h2>

        <div className='w-full md:w-2/3 lg:w-1/2'>
          <TextInput
            id='new-password'
            onChange={setNewPassword}
            value={newPassword}
            type='password'
            placeholder='New password'
            variant='light'
            label='New password'
          />
        </div>

        <Button
          onClick={onChangePasswordClick}
          disabled={!newPassword}
          className='w-full md:w-auto'
        >
          Change password
        </Button>
      </form>
    </Page>
  )
}
