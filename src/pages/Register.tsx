import { useState } from 'react'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import Link from '../components/Link'
import { useSetRecoilState } from 'recoil'
import registerUser from '../api/register'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import { unauthedContainerStyle } from '../styles/theme'
import buildError from '../utils/buildError'
import AuthService from '../services/AuthService'
import { useLocation } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import RegisterPlanBanner from '../components/billing/RegisterPlanBanner'
import Checkbox from '../components/Checkbox'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import routes from '../constants/routes'
import userState from '../state/userState'
import { z } from 'zod'

const validationSchema = z.object({
  organisationName: z.string().optional(),
  username: z.string().min(1, { message: 'Username is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
  termsAccepted: z.boolean().refine((val) => val === true, { message: 'Terms must be accepted' }),
  hasInvite: z.boolean()
}).superRefine(({ hasInvite, organisationName }, ctx) => {
  if (!hasInvite && !organisationName?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Team name is required',
      path: ['organisationName']
    })
    return false
  }
  return true
})

type FormValues = z.infer<typeof validationSchema>

export default function Register() {
  const location = useLocation()

  const setUser = useSetRecoilState(userState)
  const [error, setError] = useState<TaloError | null>(null)
  const [isLoading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { isValid, errors }, control } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: location.state?.invite.email ?? '',
      termsAccepted: false,
      hasInvite: Boolean(location.state?.invite)
    },
    mode: 'onBlur'
  })

  const onRegisterClick = async ({ email, password, organisationName, username }: FormValues) => {
    setError(null)
    setLoading(true)

    try {
      const { accessToken, user } = await registerUser({ email, password, organisationName, username, inviteToken: location.state?.invite.token })
      AuthService.setToken(accessToken)
      setUser(user)

      Sentry.setUser({ id: user.id, username: user.username })
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }

  return (
    <div className='h-full p-8 flex flex-col md:items-center md:justify-center'>
      <form className={clsx(unauthedContainerStyle, 'text-white space-y-8')} onSubmit={handleSubmit(onRegisterClick)}>
        <h1 className='text-4xl font-bold'>Let&apos;s get started</h1>

        <RegisterPlanBanner />

        {location.state?.invite &&
          <p>
            <span role='img' aria-label='Success'>🎉</span> <span className='font-semibold'>{location.state.invite.organisation.name}</span> has invited you to join them on Talo
          </p>
        }

        {!location.state?.invite &&
          <TextInput
            id='name'
            label='Team name'
            placeholder={'Your team\'s name'}
            type='text'
            inputExtra={{ ...register('organisationName') }}
            errors={[errors.organisationName?.message]}
          />
        }

        <TextInput
          id='username'
          label='Username'
          type='text'
          placeholder='Your name or a screen name'
          inputExtra={{ ...register('username') }}
          errors={[errors.username?.message]}
        />

        <TextInput
          id='email'
          disabled={Boolean(location.state?.invite)}
          label='Email'
          type='email'
          placeholder='For transactional notifications'
          inputExtra={{ ...register('email') }}
          errors={[errors.email?.message]}
        />

        <TextInput
          id='password'
          label='Password'
          placeholder='Keep it secure'
          type='password'
          inputExtra={{ ...register('password') }}
          errors={[errors.password?.message]}
        />

        <Controller
          control={control}
          name='termsAccepted'
          render={({
            field: { onChange, value, ref }
          }) => (
            <Checkbox
              id='terms'
              inputRef={ref}
              checked={value}
              onChange={onChange}
              labelContent={<>I agree to the <Link to='https://trytalo.com/terms'>Terms of Use</Link> and <Link to='https://trytalo.com/privacy'>Privacy Policy</Link></>}
            />
          )}
        />

        {error && <ErrorMessage error={error} />}

        <Button
          disabled={!isValid}
          isLoading={isLoading}
        >
          Sign up
        </Button>
      </form>

      <div className={unauthedContainerStyle}>
        <p className='mt-4 text-white'>Already have an account? <Link to={routes.login}>Log in here</Link></p>
      </div>
    </div>
  )
}
