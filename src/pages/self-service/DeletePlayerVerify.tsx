import type { MouseEvent } from 'react'
import { useState } from 'react'
import { verifySelfService } from '../../api/self-service/verifySelfService'
import Button from '../../components/Button'
import ErrorMessage, { TaloError } from '../../components/ErrorMessage'
import TextInput from '../../components/TextInput'
import { UnauthedContainer } from '../../components/UnauthedContainer'
import { UnauthedContainerInner } from '../../components/UnauthedContainerInner'
import { UnauthedTitle } from '../../components/UnauthedTitle'
import buildError from '../../utils/buildError'

type Props = {
  gameToken: string
  aliasId: number
  onSuccess: ({ identifier, sessionToken }: { identifier: string; sessionToken: string }) => void
}

export function DeletePlayerVerify({ gameToken, aliasId, onSuccess }: Props) {
  const [code, setCode] = useState('')
  const [error, setError] = useState<TaloError | null>(null)
  const [isLoading, setLoading] = useState(false)

  const onVerifyClick = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await verifySelfService(gameToken, aliasId, code)
      onSuccess({
        identifier: res.alias.identifier,
        sessionToken: res.sessionToken,
      })
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }

  return (
    <UnauthedContainer>
      <UnauthedContainerInner as='form'>
        <UnauthedTitle>Verify your identity</UnauthedTitle>

        <p>We sent a 6-digit code to your email.</p>

        <TextInput
          id='code'
          label='Verification code'
          placeholder='000000'
          onChange={setCode}
          value={code}
        />

        {error && <ErrorMessage error={error} />}

        <Button disabled={code.length !== 6} onClick={onVerifyClick} isLoading={isLoading}>
          Verify
        </Button>
      </UnauthedContainerInner>
    </UnauthedContainer>
  )
}
