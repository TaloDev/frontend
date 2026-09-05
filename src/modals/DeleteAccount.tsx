import { useNavigate } from 'react-router'
import Button from '../components/Button'
import Modal from '../components/Modal'
import routes from '../constants/routes'
import { UserType } from '../entities/user'
import { ConfirmPasswordAction } from '../pages/ConfirmPassword'

type DeleteAccountProps = {
  modalState: [boolean, (open: boolean) => void]
  userType: UserType
}

export function DeleteAccount({ modalState, userType }: DeleteAccountProps) {
  const navigate = useNavigate()

  const onDeleteClick = () => {
    navigate(routes.confirmPassword, {
      state: {
        onConfirmAction: ConfirmPasswordAction.DELETE_ACCOUNT,
      },
    })
  }

  return (
    <Modal
      id='delete-account'
      title='Delete account'
      modalState={modalState}
      scroll={false}
      footer={
        <div className='mt-auto flex flex-col space-y-4 border-t border-gray-200 p-4 md:flex-row-reverse md:justify-between md:space-y-0'>
          <div className='w-full md:w-32'>
            <Button type='button' variant='red' onClick={onDeleteClick}>
              Delete
            </Button>
          </div>
          <div className='w-full md:w-32'>
            <Button type='button' variant='grey' onClick={() => modalState[1](false)}>
              Cancel
            </Button>
          </div>
        </div>
      }
    >
      <div className='space-y-4 p-4'>
        <p>
          {userType === UserType.OWNER
            ? 'Your account and organisation will be permanently deleted, along with all of your games and their data. '
            : 'Your account and all associated data will be permanently deleted. '}
          <span className='font-semibold'>This action cannot be undone</span>.
        </p>
      </div>
    </Modal>
  )
}
