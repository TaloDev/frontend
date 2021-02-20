import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import getAPIKeys from '../api/getAPIKeys'
import activeGameState from '../state/activeGameState'
import ErrorMessage from '../components/ErrorMessage'
import Loading from '../components/Loading'
import buildError from '../utils/buildError'
import { format } from 'date-fns'
import classNames from 'classnames'
import Title from '../components/Title'
import Button from '../components/Button'
import deleteAPIKey from '../api/deleteAPIKey'
import getAPIKeyScopes from '../api/getAPIKeyScopes'
import createAPIKey from '../api/createAPIKey'
import userState from '../state/userState'
import { IconAlertCircle } from '@tabler/icons'

const APIKeys = () => {
  const [isLoading, setLoading] = useState(true)
  const [keys, setKeys] = useState([])
  const [error, setError] = useState(null)
  const activeGame = useRecoilValue(activeGameState)
  const [deletingKeys, setDeletingKeys] = useState([])
  const [availableScopes, setAvailableScopes] = useState({})
  const [selectedScopes, setSelectedScopes] = useState([])
  const [isCreating, setCreating] = useState(false)
  const [createdKey, setCreatedKey] = useState(null)
  const user = useRecoilValue(userState)

  useEffect(() => {
    if (activeGame) {
      (async () => {
        setError(null)
        setCreatedKey(null)

        try {
          let res = await getAPIKeys(activeGame.id)
          setKeys(res.data.apiKeys)

          res = await getAPIKeyScopes()
          setAvailableScopes(res.data.scopes)
        } catch (err) {
          setError(buildError(err))
        } finally {
          setLoading(false)
        }
      })()
    }
  }, [activeGame])

  const onDeleteClick = async (apiKey) => {
    setError(null)
    setDeletingKeys([...deletingKeys, apiKey.id])

    try {
      await deleteAPIKey(apiKey.id)
      setKeys(keys.filter((k) => k.id !== apiKey.id))
      setError(null)
    } catch (err) {
      setError(buildError(err))
    } finally {
      setDeletingKeys(deletingKeys.filter((k) => k !== apiKey.id))
    }
  }

  const onCreateClick = async (e) => {
    e.preventDefault()
    setError(null)
    setCreating(true)

    try {
      const res = await createAPIKey(activeGame.id, selectedScopes)
      setCreatedKey(res.data.token)
      setKeys([...keys, res.data.apiKey])
      setSelectedScopes([])
    } catch (err) {
      setError(buildError(err))
      window.scrollTo(0, 0)
    } finally {
      setCreating(false)
    }
  }

  const onScopeChecked = (e) => {
    if (e.target.checked) {
      setSelectedScopes([...selectedScopes, e.target.value])
    } else {
      setSelectedScopes(selectedScopes.filter((s) => s !== e.target.value))
    }
  }

  return (
    <div className='space-y-4 md:space-y-8'>
      <Title>Access keys {keys.length > 0 && `(${keys.length})`}</Title>

      {isLoading &&
        <div className='flex justify-center'>
          <Loading />
        </div>
      }

      {error && <ErrorMessage error={error} />}

      {!user.emailConfirmed &&
        <div className='bg-yellow-600 p-4 rounded lg:w-max flex items-center space-x-2'>
          <IconAlertCircle size={24} />
          <span className='ml-2'>You need to confirm your email address to create API keys.</span>
        </div>
      }

      {keys.length > 0 &&
        <div className='overflow-x-scroll -mx-4 md:-mx-8'>
          <div className='w-min px-4 md:px-8'>
            <div className='flex items-start p-4 bg-white text-black font-semibold w-min rounded-t'>
              <span className='min-w-40'>Ending in</span>
              <span className='min-w-80'>Created by</span>
              <span className='min-w-60'>Created at</span>
              <span className='min-w-40'></span>
            </div>
            <ul className='w-min rounded-b overflow-hidden'>
              {keys.map((key, idx) => (
                <li key={key.id} className={classNames('flex items-center p-4', { 'bg-indigo-600': idx % 2 !== 0, 'bg-indigo-500': idx % 2 === 0 })}>
                  <span className='min-w-40'>…{key.token}</span>
                  <span className='min-w-80'>{key.createdBy}</span>
                  <span className='min-w-60'>{format(new Date(key.createdAt), 'do MMM Y')}</span>
                  <span className='min-w-40'>
                    <Button variant='red' onClick={() => onDeleteClick(key)}>Revoke</Button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      }

      {keys.length > 0 && <div className='h-1 rounded bg-gray-700' />}

      {!createdKey &&
        <form className='w-full lg:2/3 xl:w-1/2'>
          <h2 className='text-xl lg:text-2xl font-bold'>Create new key</h2>

          <div className='mt-4 rounded border-2 border-gray-700'>
            <div className='p-4 bg-gray-700'>
              <h3 className='text-lg font-bold'>Scopes</h3>
              <p>Scopes control what your access key can and can't do.</p>
            </div>
            
            <div className='flex space-x-8 p-4'>
              {Object.keys(availableScopes).map((group) => (
                <div key={group}>
                  <h4 className='font-semibold capitalize'>{group}</h4>
                  {availableScopes[group].map((scope) => (
                    <div key={scope}>
                      <input
                        id={scope}
                        type='checkbox'
                        disabled={!user.emailConfirmed}
                        onChange={onScopeChecked}
                        checked={Boolean(selectedScopes.find((s) => s === scope))}
                        value={scope}
                      />
                      <label htmlFor={scope} className='ml-2'>{scope}</label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <Button
            isLoading={isCreating}
            variant='green'
            className='mt-4'
            onClick={onCreateClick}
            disabled={!user.emailConfirmed}
          >
            Create
          </Button>
        </form>
      }

      {createdKey &&
        <div className='w-full lg:2/3 xl:w-1/2'>
          <h2 className='text-xl lg:text-2xl font-bold'>Your new key</h2>
          <p>Save this key somewhere because we won't show it again</p>
          
          <div className='mt-4 rounded border-2 border-gray-700 bg-gray-700 p-4 break-words'>
            <code>{createdKey}</code>
          </div>

          <Button
            className='mt-4'
            onClick={() => setCreatedKey(null)}
          >
            Create another
          </Button>
        </div>
      }
    </div>
  )
}

export default APIKeys
