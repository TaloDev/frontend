import React from 'react'
import PropTypes from 'prop-types'
import Button from './Button'
import classNames from 'classnames'

const TimePeriodPicker = (props) => {
  const buttonClassName = 'text-sm md:text-base border-2 border-l-0 py-1 px-1 md:py-1.5 md:px-2 border-indigo-500 rounded-none first:rounded-l first:border-l-2 last:rounded-r hover:bg-gray-900 ring-inset'

  return (
    <div>
      {props.periods.map((period) => (
        <Button
          key={period.id}
          variant='bare'
          className={classNames(buttonClassName, { 'bg-indigo-500 hover:!bg-indigo-500': period.id === props.selectedPeriod })}
          onClick={() => props.onPick(period)}
        >
          {period.label}
        </Button>
      ))}
    </div>
  )
}

TimePeriodPicker.propTypes = {
  periods: PropTypes.arrayOf(PropTypes.object).isRequired,
  onPick: PropTypes.func.isRequired,
  selectedPeriod: PropTypes.string.isRequired
}

export default TimePeriodPicker
