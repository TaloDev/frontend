import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DateInput from '../DateInput'

describe('<DateInput />', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(new Date(2022, 0, 1))
  })

  it('should the date as dd MMM yyyy', () => {
    render(
      <DateInput
        id='test'
        mode='single'
        onChange={() => jest.fn()}
        value='2022-03-03'
      />
    )

    expect(screen.getByDisplayValue('03 Mar 2022')).toBeInTheDocument()
  })

  it('should render the default as today', () => {
    render(
      <DateInput
        id='test'
        mode='single'
        onChange={() => jest.fn()}
        value=''
      />
    )

    expect(screen.getByDisplayValue('01 Jan 2022')).toBeInTheDocument()
  })

  it('should pick a date', async () => {
    const changeMock = jest.fn()

    render(
      <DateInput
        id='test'
        mode='single'
        onChange={(value) => changeMock(value)}
        value=''
      />
    )

    userEvent.click(screen.getByDisplayValue('01 Jan 2022'))
    expect(await screen.findByText('January 2022')).toBeInTheDocument()
    userEvent.click(screen.getByText('15'))
    expect(changeMock).toHaveBeenCalledWith('2022-01-15T00:00:00.000Z')
  })
})
