import type { MouseEvent } from 'react'
import { useState } from 'react'
import { deleteAuthAccount } from '../../api/self-service/deleteAuthAccount'
import Button from '../../components/Button'
import ErrorMessage, { TaloError } from '../../components/ErrorMessage'
import TextInput from '../../components/TextInput'
import { UnauthedContainer } from '../../components/UnauthedContainer'
import { UnauthedContainerInner } from '../../components/UnauthedContainerInner'
import { UnauthedTitle } from '../../components/UnauthedTitle'
import buildError from '../../utils/buildError'

type Props = {
  gameToken: string
  identifier: string
  sessionToken: string
}

export function DeletePlayerConfirm({ gameToken, sessionToken, identifier }: Props) {
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState<TaloError | null>(null)
  const [isLoading, setLoading] = useState(false)
  const [deleted, setDeleted] = useState(false)

  const onDeleteClick = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await deleteAuthAccount(gameToken, sessionToken)
      setDeleted(true)
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }

  if (deleted) {
    return (
      <UnauthedContainer>
        <UnauthedContainerInner>
          <UnauthedTitle>Account deleted</UnauthedTitle>
          <p>Your account has been successfully deleted.</p>
        </UnauthedContainerInner>
      </UnauthedContainer>
    )
  }

  return (
    <UnauthedContainer>
      <UnauthedContainerInner as='form'>
        <UnauthedTitle>Confirm deletion</UnauthedTitle>

        <p>This action is permanent and cannot be undone.</p>

        <TextInput
          id='confirmation'
          label='Confirm your identifier'
          placeholder='Identifier'
          onChange={setConfirmation}
          value={confirmation}
        />

        {error && <ErrorMessage error={error} />}

        <Button
          disabled={confirmation !== identifier}
          variant='red'
          onClick={onDeleteClick}
          isLoading={isLoading}
        >
          Delete account
        </Button>
      </UnauthedContainerInner>
    </UnauthedContainer>
  )
}
