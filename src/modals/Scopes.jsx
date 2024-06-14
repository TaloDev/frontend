import PropTypes from 'prop-types'
import Modal from '../components/Modal'
import Button from '../components/Button'
import { useRecoilValue } from 'recoil'
import userState from '../state/userState'
import { useCallback, useContext, useState } from 'react'
import updateAPIKey from '../api/updateAPIKey'
import activeGameState from '../state/activeGameState'
import ErrorMessage from '../components/ErrorMessage'
import buildError from '../utils/buildError'
import ToastContext from '../components/toast/ToastContext'

export default function Scopes({ modalState, selectedKey, availableScopes, mutate }) {
  const [, setOpen] = modalState

  const toast = useContext(ToastContext)

  const activeGame = useRecoilValue(activeGameState)
  const user = useRecoilValue(userState)

  const [selectedScopes, setSelectedScopes] = useState(selectedKey?.scopes ?? [])
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const onScopeChecked = useCallback((e) => {
    if (e.target.checked) {
      setSelectedScopes([...selectedScopes, e.target.value])
    } else {
      setSelectedScopes(selectedScopes.filter((s) => s !== e.target.value))
    }
  }, [selectedScopes])

  const onAllScopesSelected = useCallback(() => {
    const allScopes = Object.values(availableScopes).flat()
    setSelectedScopes(allScopes)
  }, [availableScopes])

  const onUpdateClick = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await updateAPIKey(activeGame.id, selectedKey.id, { scopes: selectedScopes })
      mutate((data) => {
        return {
          ...data,
          apiKeys: data.apiKeys.map((k) => {
            if (k.id === selectedKey.id) {
              return res.data.apiKey
            }

            return k
          })
        }
      })

      toast.trigger('Access key scopes updated', 'success')
      setOpen(false)
    } catch (err) {
      setError(buildError(err))
    } finally {
      setLoading(false)
    }
  })

  return (
    <Modal
      id='scopes'
      title='Access key scopes'
      modalState={modalState}
    >
      <div>
        <div className='p-4 space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4'>
            {availableScopes && Object.keys(availableScopes).map((group) => (
              <div key={group} className='p-4 bg-gray-100 rounded'>
                <h4 className='font-semibold capitalize'>{group}</h4>
                {availableScopes[group].map((scope) => (
                  <div key={scope}>
                    <input
                      id={`modal-${scope}`}
                      type='checkbox'
                      onChange={onScopeChecked}
                      checked={Boolean(selectedScopes.find((s) => s === scope)) || selectedScopes.includes('*')}
                      value={scope}
                    />
                    <label htmlFor={`modal-${scope}`} className='ml-2'>{scope}</label>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <Button className='!w-auto' variant='black' onClick={onAllScopesSelected}>
            Select all scopes
          </Button>
          {error && <ErrorMessage error={error} />}
        </div>

        <div className='flex flex-col md:flex-row-reverse md:justify-between space-y-4 md:space-y-0 p-4 border-t border-gray-200'>
          <div className='w-full md:w-32'>
            <Button
              disabled={!user.emailConfirmed}
              isLoading={isLoading}
              onClick={onUpdateClick}
            >
              Update
            </Button>
          </div>
          <div className='w-full md:w-32'>
            <Button variant='grey' onClick={() => setOpen(false)}>Close</Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

Scopes.propTypes = {
  modalState: PropTypes.array.isRequired,
  selectedKey: PropTypes.object,
  availableScopes: PropTypes.object,
  mutate: PropTypes.func.isRequired
}
