import HCaptcha from '@hcaptcha/react-hcaptcha'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Sentry from '@sentry/react'
import clsx from 'clsx'
import { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useLocation } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { z } from 'zod'
import registerUser from '../api/register'
import RegisterPlanBanner from '../components/billing/RegisterPlanBanner'
import Button from '../components/Button'
import Checkbox from '../components/Checkbox'
import ErrorMessage, { TaloError } from '../components/ErrorMessage'
import Link from '../components/Link'
import TextInput from '../components/TextInput'
import routes from '../constants/routes'
import AuthService from '../services/AuthService'
import userState from '../state/userState'
import { unauthedContainerStyle } from '../styles/theme'
import buildError from '../utils/buildError'

const captchaKey = import.meta.env.VITE_HCAPTCHA_SITE_KEY

const validationSchema = z
  .object({
    organisationName: z.string().optional(),
    username: z.string().min(1, { message: 'Username is required' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z.string().min(1, { message: 'Password is required' }),
    termsAccepted: z.boolean().refine((val) => val === true, { message: 'Terms must be accepted' }),
    hasInvite: z.boolean(),
    captchaToken: captchaKey
      ? z.string().min(1, { message: 'Please complete the captcha' })
      : z.string().optional(),
  })
  .superRefine(({ hasInvite, organisationName }, ctx) => {
    if (!hasInvite && !organisationName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Team or studio name is required',
        path: ['organisationName'],
      })
      return false
    }
    return true
  })

type FormValues = z.infer<typeof validationSchema>

export default function Register() {
  const location = useLocation()

  const setUser = useSetRecoilState(userState)
  const [apiError, setAPIError] = useState<TaloError | null>(null)
  const [isLoading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    control,
  } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: location.state?.invite.email ?? '',
      termsAccepted: false,
      hasInvite: Boolean(location.state?.invite),
      captchaToken: '',
    },
    mode: 'onTouched',
  })

  const captchaRef = useRef<HCaptcha | null>(null)

  const onRegisterClick = async ({
    email,
    password,
    organisationName,
    username,
    captchaToken,
  }: FormValues) => {
    setAPIError(null)
    setLoading(true)

    try {
      const { accessToken, user } = await registerUser({
        email,
        password,
        organisationName,
        username,
        inviteToken: location.state?.invite.token,
        captchaToken,
      })

      AuthService.setToken(accessToken)
      setUser(user)

      Sentry.setUser({ id: user.id, username: user.username })
    } catch (err) {
      setAPIError(buildError(err))
      setLoading(false)
      captchaRef.current?.resetCaptcha()
    }
  }

  return (
    <div className='flex h-full flex-col p-8 md:items-center md:justify-center'>
      <form
        className={clsx(unauthedContainerStyle, 'space-y-8 text-white')}
        onSubmit={handleSubmit(onRegisterClick)}
      >
        <h1 className='text-4xl font-bold'>Let&apos;s get started</h1>

        <RegisterPlanBanner />

        {location.state?.invite && (
          <p>
            <span role='img' aria-label='Success'>
              🎉
            </span>{' '}
            <span className='font-semibold'>{location.state.invite.organisation.name}</span> has
            invited you to join them on Talo
          </p>
        )}

        {!location.state?.invite && (
          <TextInput
            id='name'
            label='Team or studio name'
            placeholder={"Your team or studio's name"}
            type='text'
            inputExtra={{ ...register('organisationName') }}
            errors={[errors.organisationName?.message]}
          />
        )}

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
          render={({ field: { onChange, value, ref } }) => (
            <Checkbox
              id='terms'
              inputRef={ref}
              checked={value}
              onChange={onChange}
              labelContent={
                <>
                  I agree to the <Link to='https://trytalo.com/terms'>terms of use</Link> and{' '}
                  <Link to='https://trytalo.com/privacy'>privacy policy</Link>
                </>
              }
            />
          )}
        />

        {!!captchaKey && (
          <Controller
            control={control}
            name='captchaToken'
            render={({ field }) => (
              <div className='flex flex-col gap-2'>
                <HCaptcha
                  ref={captchaRef}
                  sitekey={captchaKey}
                  onVerify={field.onChange}
                  onExpire={() => field.onChange('')}
                  onError={() => field.onChange('')}
                  size='normal'
                />
                {errors.captchaToken && (
                  <p role='alert' className='font-medium text-red-500'>
                    {errors.captchaToken.message}
                  </p>
                )}
              </div>
            )}
          />
        )}

        {apiError && <ErrorMessage error={apiError} />}

        <Button disabled={!isValid} isLoading={isLoading}>
          Sign up
        </Button>
      </form>

      <div className={unauthedContainerStyle}>
        <p className='mt-4 text-white'>
          Already have an account? <Link to={routes.login}>Log in here</Link>
        </p>
      </div>
    </div>
  )
}
