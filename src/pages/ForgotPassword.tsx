import { useState } from 'react'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import buildError from '../utils/buildError'
import routes from '../constants/routes'
import { unauthedContainerStyle } from '../styles/theme'
import Title from '../components/Title'
import Link from '../components/Link'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import requestNewPassword from '../api/requestNewPassword'
import { IconCheck } from '@tabler/icons-react'
import AlertBanner from '../components/AlertBanner'
import { z } from 'zod'

const validationSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' })
})

type FormValues = z.infer<typeof validationSchema>

export default function ForgotPassword() {
  const [apiError, setAPIError] = useState<TaloError | null>(null)
  const [isLoading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const { register, handleSubmit, formState: { isValid, errors } } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    mode: 'onBlur',
    defaultValues: { email: '' }
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
    <div className='h-full p-8 flex flex-col md:items-center md:justify-center'>
      <form className={`text-white space-y-8 ${unauthedContainerStyle}`} onSubmit={handleSubmit(onConfirmClick)}>
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

        <Button
          disabled={!isValid || emailSent}
          isLoading={isLoading}
        >
          Confirm
        </Button>

        {emailSent &&
          <AlertBanner className='bg-green-600' icon={IconCheck} text={'If an account exists for this email, you\'ll receive an email with instructions on how to reset your password'} />
        }
      </form>

      <div className={unauthedContainerStyle}>
        <p className='mt-4 text-white'><Link to={routes.login}>Back to Login</Link></p>
      </div>
    </div>
  )
}
