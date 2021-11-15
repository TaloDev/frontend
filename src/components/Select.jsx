import React from 'react'
import ReactSelect from 'react-select'

function Select(props) {
  const styles = {
    control: (provided, state) => ({
      ...provided,
      border: `1px solid ${state.isFocused ? 'transparent' : '#D1D5DB'} !important`,
      boxShadow: state.isFocused && 'rgb(255, 255, 255) 0px 0px 0px 0px, rgb(236, 72, 153) 0px 0px 0px 3px, rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      paddingTop: '2px',
      paddingBottom: '2px',
      transition: 'none'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected && '#6366F1',
      ':hover': {
        backgroundColor: !state.isSelected && '#E0E7FF'
      }
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#000',
      padding: '0px'
    })
  }

  return (
    <ReactSelect {...props} styles={styles} />
  )
}

export default Select
