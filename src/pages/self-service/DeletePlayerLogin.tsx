import type { MouseEvent } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { loginSelfService } from '../../api/self-service/loginSelfService'
import Button from '../../components/Button'
import ErrorMessage, { TaloError } from '../../components/ErrorMessage'
import TextInput from '../../components/TextInput'
import { UnauthedContainer } from '../../components/UnauthedContainer'
import { UnauthedContainerInner } from '../../components/UnauthedContainerInner'
import { UnauthedTitle } from '../../components/UnauthedTitle'
import buildError from '../../utils/buildError'

type Props = {
  gameName: string
  onVerificationRequired: (aliasId: number) => void
  onSuccess: ({ identifier, sessionToken }: { identifier: string; sessionToken: string }) => void
}

export function DeletePlayerLogin({ gameName, onVerificationRequired, onSuccess }: Props) {
  const { token = '' } = useParams<{ token: string }>()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<TaloError | null>(null)
  const [isLoading, setLoading] = useState(false)

  const onLoginClick = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await loginSelfService(token, identifier, password)
      if ('verificationRequired' in res) {
        onVerificationRequired(res.aliasId)
      } else {
        onSuccess({
          identifier: res.alias.identifier,
          sessionToken: res.sessionToken,
        })
      }
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }

  return (
    <UnauthedContainer>
      <UnauthedContainerInner as='form'>
        <UnauthedTitle>Delete your {gameName} account</UnauthedTitle>

        <p>Enter your account details to get started.</p>

        <TextInput
          id='identifier'
          label='Identifier'
          placeholder='Identifier'
          onChange={setIdentifier}
          value={identifier}
        />

        <TextInput
          id='password'
          label='Password'
          placeholder='Password'
          type='password'
          onChange={setPassword}
          value={password}
        />

        {error && <ErrorMessage error={error} />}

        <Button disabled={!identifier || !password} onClick={onLoginClick} isLoading={isLoading}>
          Login
        </Button>
      </UnauthedContainerInner>
    </UnauthedContainer>
  )
}
