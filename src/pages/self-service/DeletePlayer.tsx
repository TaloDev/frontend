import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGameFromToken } from '../../api/self-service/useGameFromToken'
import ErrorMessage from '../../components/ErrorMessage'
import Loading from '../../components/Loading'
import { UnauthedContainer } from '../../components/UnauthedContainer'
import { DeletePlayerConfirm } from './DeletePlayerConfirm'
import { DeletePlayerLogin } from './DeletePlayerLogin'
import { DeletePlayerVerify } from './DeletePlayerVerify'

type Step = 'login' | 'verify' | 'confirm'

export default function DeletePlayer() {
  const { token = '' } = useParams<{ token: string }>()
  const { game, loading, error } = useGameFromToken(token)

  const [step, setStep] = useState<Step>('login')
  const [aliasId, setAliasId] = useState(0)
  const [identifier, setIdentifier] = useState('')
  const [sessionToken, setSessionToken] = useState('')

  const handleVerificationRequired = useCallback((id: number) => {
    setAliasId(id)
    setStep('verify')
  }, [])

  const handleIdentified = useCallback(
    ({ identifier, sessionToken }: { identifier: string; sessionToken: string }) => {
      setIdentifier(identifier)
      setSessionToken(sessionToken)
      setStep('confirm')
    },
    [],
  )

  if (loading) {
    return (
      <UnauthedContainer>
        <Loading />
      </UnauthedContainer>
    )
  }

  if (error) {
    return (
      <UnauthedContainer>
        <ErrorMessage error={error} />
      </UnauthedContainer>
    )
  }

  if (step === 'login') {
    return (
      <DeletePlayerLogin
        gameName={game!.name}
        onVerificationRequired={handleVerificationRequired}
        onSuccess={handleIdentified}
      />
    )
  }

  if (step === 'verify') {
    return <DeletePlayerVerify aliasId={aliasId} onSuccess={handleIdentified} />
  }

  return <DeletePlayerConfirm identifier={identifier} sessionToken={sessionToken} />
}
