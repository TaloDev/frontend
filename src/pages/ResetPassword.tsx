import { zodResolver } from '@hookform/resolvers/zod'
import { IconCheck } from '@tabler/icons-react'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import resetPassword from '../api/resetPassword'
import AlertBanner from '../components/AlertBanner'
import Button from '../components/Button'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Link from '../components/Link'
import TextInput from '../components/TextInput'
import Title from '../components/Title'
import routes from '../constants/routes'
import { unauthedContainerStyle } from '../styles/theme'
import buildError from '../utils/buildError'

const validationSchema = z
  .object({
    password: z.string().min(8, { message: 'Password is required' }),
    confirmPassword: z.string().min(8, { message: 'Confirm password is required' }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'These passwords do not match',
        path: ['confirmPassword'],
      })
      return false
    }
    return true
  })

type FormValues = z.infer<typeof validationSchema>

export default function ResetPassword() {
  const [token] = useState(new URLSearchParams(window.location.search).get('token'))
  const [apiError, setAPIError] = useState<TaloError | null>(null)
  const [isLoading, setLoading] = useState(false)
  const [resetComplete, setResetComplete] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    if (!token) navigate(routes.login)
  }, [token, navigate])

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    mode: 'onTouched',
  })

  const onConfirmClick: SubmitHandler<FormValues> = async ({ password }) => {
    setAPIError(null)
    setLoading(true)

    try {
      await resetPassword(token!, password)
      setResetComplete(true)
    } catch (err) {
      setAPIError(buildError(err))
    } finally {
      setLoading(false)
    }
  }

  if (resetComplete) {
    return (
      <div className='flex h-full flex-col p-8 md:items-center md:justify-center'>
        <div className={clsx('space-y-8 text-white', unauthedContainerStyle)}>
          <Title>Reset password</Title>

          <AlertBanner
            className='bg-green-600'
            icon={IconCheck}
            text='Success! Your password has been reset'
          />

          <Button type='button' onClick={() => navigate(routes.login)}>
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='flex h-full flex-col p-8 md:items-center md:justify-center'>
      <form
        className={clsx('space-y-8 text-white', unauthedContainerStyle)}
        onSubmit={handleSubmit(onConfirmClick)}
      >
        <Title>Reset password</Title>

        <TextInput
          id='password'
          label='New password'
          type='password'
          placeholder='Password'
          inputExtra={{ ...register('password') }}
          errors={[errors.password?.message]}
        />

        <TextInput
          id='confirm-password'
          label='Confirm password'
          type='password'
          placeholder='Confirm password'
          inputExtra={{ ...register('confirmPassword') }}
          errors={[errors.confirmPassword?.message]}
        />

        {apiError && (
          <ErrorMessage error={apiError}>
            {apiError?.extra?.expired && (
              <span>
                {' '}
                -{' '}
                <Link to={routes.forgotPassword} className='!text-white underline'>
                  please request a new reset link
                </Link>
              </span>
            )}
          </ErrorMessage>
        )}

        <Button disabled={!isValid} isLoading={isLoading}>
          Confirm
        </Button>
      </form>
    </div>
  )
}
