import React from 'react'
import PropTypes from 'prop-types'

const HeadlineStat = (props) => {
  return (
    <div className={`rounded border-2 border-gray-700 w-full text-center md:text-left ${props.className ?? ''}`}>
      <div className='p-4 bg-gray-700'>
        <h3 className='text-lg font-bold'>{props.title}</h3>
      </div>

      <div className='p-4'>
        <p className='text-4xl md:text-6xl'>{props.stat}</p>
      </div>
    </div>
  )
}

HeadlineStat.propTypes = {
  title: PropTypes.string.isRequired,
  stat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  className: PropTypes.string
}

export default HeadlineStat
