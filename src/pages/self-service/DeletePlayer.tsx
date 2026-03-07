import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGameFromToken } from '../../api/self-service/useGameFromToken'
import ErrorMessage from '../../components/ErrorMessage'
import Loading from '../../components/Loading'
import { UnauthedContainer } from '../../components/UnauthedContainer'
import { UnauthedContainerInner } from '../../components/UnauthedContainerInner'
import { DeletePlayerConfirm } from './DeletePlayerConfirm'
import { DeletePlayerLogin } from './DeletePlayerLogin'
import { DeletePlayerVerify } from './DeletePlayerVerify'

type Step = 'login' | 'verify' | 'confirm'

export default function DeletePlayer() {
  const { gameToken = '' } = useParams<{ gameToken: string }>()
  const { game, loading, error } = useGameFromToken(gameToken)

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
        <UnauthedContainerInner className='flex justify-center'>
          <Loading />
        </UnauthedContainerInner>
      </UnauthedContainer>
    )
  }

  if (error) {
    return (
      <UnauthedContainer>
        <UnauthedContainerInner>
          <ErrorMessage error={error} />
        </UnauthedContainerInner>
      </UnauthedContainer>
    )
  }

  if (step === 'login') {
    return (
      <DeletePlayerLogin
        gameName={game!.name}
        gameToken={gameToken}
        onVerificationRequired={handleVerificationRequired}
        onSuccess={handleIdentified}
      />
    )
  }

  if (step === 'verify') {
    return (
      <DeletePlayerVerify gameToken={gameToken} aliasId={aliasId} onSuccess={handleIdentified} />
    )
  }

  return (
    <DeletePlayerConfirm
      gameToken={gameToken}
      identifier={identifier}
      sessionToken={sessionToken}
    />
  )
}
