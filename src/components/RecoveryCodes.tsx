import { ReactNode, useState } from 'react'
import { IconCheck, IconCopy, IconDownload } from '@tabler/icons-react'
import Button from './Button'
import AlertBanner from './AlertBanner'
import routes from '../constants/routes'
import { ConfirmPasswordAction } from '../pages/ConfirmPassword'
import { useNavigate } from 'react-router-dom'

type RecoveryCodesProps = {
  codes: string[]
  showCreateButton?: boolean
  withBackground?: boolean
}

function RecoveryCodes({
  codes,
  showCreateButton,
  withBackground
}: RecoveryCodesProps) {
  const navigate = useNavigate()

  const [codesCopied, setCodesCopied] = useState(false)

  const onCopyCodesClick = async () => {
    await navigator.clipboard.writeText(codes.join('\n\n'))
    setCodesCopied(true)
  }

  const onDownloadCodesClick = () => {
    const anchor = document.createElement('a')
    const file = new Blob([codes.join('\n\n')], { type: 'text/plain' })

    anchor.href= URL.createObjectURL(file)
    anchor.download = 'talo-recovery-codes.txt'
    anchor.click()

    URL.revokeObjectURL(anchor.href)

    anchor.remove()
  }

  const onCreateRecoveryCodesClick = () => {
    navigate(routes.confirmPassword, {
      state: {
        onConfirmAction: ConfirmPasswordAction.CREATE_RECOVERY_CODES
      }
    })
  }

  const Container = withBackground
    ? ({ children }: { children: ReactNode }) => <div className='bg-gray-900 p-4 rounded space-y-4'>{children}</div>
    : ({ children }: { children: ReactNode }) => <>{children}</>

  return (
    <Container>
      <AlertBanner
        className='items-start!'
        text={'Keep these codes safe. If you lose access to your authenticator and don\'t have any recovery codes, you will lose access to your account.'}
      />

      <ul className='grid grid-cols-2 md:grid-cols-4 gap-y-4 bg-gray-800 py-4 rounded'>
        {codes.map((recoveryCode) => <li key={recoveryCode} className='text-center tracking-wider'><code>{recoveryCode}</code></li>)}
      </ul>

      <div className='md:flex space-y-4 md:space-y-0 md:space-x-4'>
        <Button
          type='button'
          className='justify-center md:w-auto'
          variant={codesCopied ? 'green' : undefined}
          onClick={onCopyCodesClick}
          icon={codesCopied ? <IconCheck /> : <IconCopy />}
        >
          <span>{codesCopied ? 'Copied' : 'Copy codes'}</span>
        </Button>

        <Button
          type='button'
          className='justify-center md:w-auto'
          onClick={onDownloadCodesClick}
          icon={<IconDownload />}
        >
          <span>Download codes</span>
        </Button>

        {showCreateButton &&
          <Button
            className='justify-center md:w-auto'
            onClick={onCreateRecoveryCodesClick}
          >
            Create new codes
          </Button>
        }
      </div>
    </Container>
  )
}

export default RecoveryCodes
