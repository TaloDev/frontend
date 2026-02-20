import { zodResolver } from '@hookform/resolvers/zod'
import { IconCheck } from '@tabler/icons-react'
import clsx from 'clsx'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import requestNewPassword from '../api/requestNewPassword'
import AlertBanner from '../components/AlertBanner'
import Button from '../components/Button'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Link from '../components/Link'
import TextInput from '../components/TextInput'
import Title from '../components/Title'
import routes from '../constants/routes'
import { unauthedContainerStyle } from '../styles/theme'
import buildError from '../utils/buildError'

const validationSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
})

type FormValues = z.infer<typeof validationSchema>

export default function ForgotPassword() {
  const [apiError, setAPIError] = useState<TaloError | null>(null)
  const [isLoading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    mode: 'onTouched',
    defaultValues: { email: '' },
  })

  const onConfirmClick: SubmitHandler<FormValues> = async ({ email }) => {
    setAPIError(null)
    setLoading(true)

    try {
      await requestNewPassword(email)
      setEmailSent(true)
    } catch (err) {
      setAPIError(buildError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex h-full flex-col p-8 md:items-center md:justify-center'>
      <form
        className={clsx('space-y-8 text-white', unauthedContainerStyle)}
        onSubmit={handleSubmit(onConfirmClick)}
      >
        <Title>Forgot password</Title>

        <TextInput
          id='email'
          label='Email'
          type='email'
          placeholder='Email'
          disabled={emailSent}
          inputExtra={{ ...register('email') }}
          errors={[errors.email?.message]}
        />

        {apiError && <ErrorMessage error={apiError} />}

        <Button disabled={!isValid || emailSent} isLoading={isLoading}>
          Confirm
        </Button>

        {emailSent && (
          <AlertBanner
            className='bg-green-600'
            icon={IconCheck}
            text={
              "If an account exists for this email, you'll receive an email with instructions on how to reset your password"
            }
          />
        )}
      </form>

      <div className={unauthedContainerStyle}>
        <p className='mt-4 text-white'>
          <Link to={routes.login}>Back to Login</Link>
        </p>
      </div>
    </div>
  )
}
