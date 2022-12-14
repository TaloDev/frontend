import React, { useState } from 'react'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import Link from '../components/Link'
import { useSetRecoilState } from 'recoil'
import userState from '../state/userState'
import registerUser from '../api/register'
import ErrorMessage from '../components/ErrorMessage'
import { unauthedContainerStyle } from '../styles/theme'
import buildError from '../utils/buildError'
import AuthService from '../services/AuthService'
import { useLocation } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import RegisterPlanBanner from '../components/billing/RegisterPlanBanner'
import Checkbox from '../components/Checkbox'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import routes from '../constants/routes'

const validationSchema = yup.object({
  organisationName: yup
    .string()
    .label('Team name')
    .when('hasInvite', {
      is: false,
      then: (schema) => schema.required()
    }),
  username: yup.string().label('Username').required(),
  email: yup.string().label('Email').email('Please enter a valid email address').required(),
  password: yup.string().label('Password').required(),
  termsAccepted: yup.boolean().label('Terms').oneOf([true])
})

export default function Register() {
  const location = useLocation()

  const setUser = useSetRecoilState(userState)
  const [error, setError] = useState(null)
  const [isLoading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { isValid, errors }, control } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: location.state?.invite.email ?? '',
      hasInvite: Boolean(location.state?.invite),
      termsAccepted: false
    },
    mode: 'onBlur'
  })

  const onRegisterClick = async ({ email, password, organisationName, username }) => {
    setError(null)
    setLoading(true)

    try {
      const res = await registerUser({ email, password, organisationName, username, inviteToken: location.state?.invite.token })
      const accessToken = res.data.accessToken
      AuthService.setToken(accessToken)
      setUser(res.data.user)

      Sentry.setUser({ id: res.data.user.id, username: res.data.user.username })
    } catch (err) {
      setError(buildError(err))
      setLoading(false)
    }
  }

  return (
    <div className='h-full p-8 flex flex-col md:items-center md:justify-center'>
      <form className={classNames(unauthedContainerStyle, 'text-white space-y-8')} onSubmit={handleSubmit(onRegisterClick)}>
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
