import { useEffect, useState } from 'react'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import ErrorMessage from '../components/ErrorMessage'
import buildError from '../utils/buildError'
import { unauthedContainerStyle } from '../styles/theme'
import Title from '../components/Title'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import resetPassword from '../api/resetPassword'
import AlertBanner from '../components/AlertBanner'
import { IconCheck } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import routes from '../constants/routes'
import Link from '../components/Link'

const validationSchema = yup.object({
  password: yup.string().label('Password').required(),
  confirmPassword: yup.string().label('Confirm password').test(
    'equal',
    'These passwords do not match',
    function(v) {
      return v === this.resolve(yup.ref('password'))
    }
  ).required()
})

export default function ResetPassword() {
  const [token] = useState(new URLSearchParams(window.location.search).get('token'))
  const [error, setError] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [resetComplete, setResetComplete] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    if (!token) navigate(routes.login)
  }, [token])

  const { register, handleSubmit, formState: { isValid, errors } } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onTouched'
  })

  const onConfirmClick = async ({ password }) => {
    setError(null)
    setLoading(true)

    try {
      await resetPassword(token, password)
      setResetComplete(true)
    } catch (err) {
      setError(buildError(err))
    } finally {
      setLoading(false)
    }
  }

  if (resetComplete) {
    return (
      <div className='h-full p-8 flex flex-col md:items-center md:justify-center'>
        <div className={`text-white space-y-8 ${unauthedContainerStyle}`}>
          <Title>Reset password</Title>

          <AlertBanner
            className='bg-green-600'
            icon={IconCheck}
            text='Success! Your password has been reset'
          />

          <Button
            type='button'
            onClick={() => navigate(routes.login)}
          >
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='h-full p-8 flex flex-col md:items-center md:justify-center'>
      <form className={`text-white space-y-8 ${unauthedContainerStyle}`} onSubmit={handleSubmit(onConfirmClick)}>
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

        {error &&
          <ErrorMessage error={error}>
            {error?.extra.expired &&
              <span> - <Link to={routes.forgotPassword} className='!text-white underline'>please request a new reset link</Link></span>
            }
          </ErrorMessage>
        }

        <Button
          disabled={!isValid}
          isLoading={isLoading}
        >
          Confirm
        </Button>
      </form>
    </div>
  )
}
