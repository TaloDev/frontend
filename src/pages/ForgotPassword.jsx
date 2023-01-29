import { useState } from 'react'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import ErrorMessage from '../components/ErrorMessage'
import buildError from '../utils/buildError'
import routes from '../constants/routes'
import { unauthedContainerStyle } from '../styles/theme'
import Title from '../components/Title'
import Link from '../components/Link'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import requestNewPassword from '../api/requestNewPassword'
import { IconCheck } from '@tabler/icons-react'
import AlertBanner from '../components/AlertBanner'

const validationSchema = yup.object({
  email: yup.string().label('Email').email('Please enter a valid email address').required()
})

export default function ForgotPassword() {
  const [error, setError] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const { register, handleSubmit, formState: { isValid, errors } } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur'
  })

  const onConfirmClick = async ({ email }) => {
    setError(null)
    setLoading(true)

    try {
      await requestNewPassword(email)
      setEmailSent(true)
    } catch (err) {
      setError(buildError(err))
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

        {error && <ErrorMessage error={error} />}

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
