import PropTypes from 'prop-types'
import Modal from '../components/Modal'
import Button from '../components/Button'

export default function Scopes(props) {
  const [, setOpen] = props.modalState

  return (
    <Modal
      id='scopes'
      title='Access key scopes'
      modalState={props.modalState}
    >
      <div>
        <div className='p-4 space-y-4'>
          <div className='text-white'>
            <div className='flex flex-wrap -mb-2'>
              {props.selectedKey?.scopes.sort((a, b) => {
                return a.split(':')[1].localeCompare(b.split(':')[1])
              }).map((scope) => (
                <code key={scope} className='bg-gray-900 rounded p-2 mr-2 text-xs md:text-sm mb-2'>{scope}</code>
              ))}
            </div>
          </div>
        </div>

        <div className='flex justify-between space-y-4 md:space-y-0 p-4 border-t border-gray-200'>
          <div />
          <div className='w-32'>
            <Button variant='grey' onClick={() => setOpen(false)}>Close</Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

Scopes.propTypes = {
  modalState: PropTypes.array.isRequired,
  selectedKey: PropTypes.object
}
