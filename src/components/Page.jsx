import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Title from './Title'
import Loading from './Loading'

function Page({ title, showBackButton, isLoading, containerClassName, extraTitleComponent, children }) {
  return (
    <div className={classNames('space-y-4 md:space-y-8', containerClassName)}>
      <div className='flex items-center'>
        <Title showBackButton={showBackButton}>{title}</Title>

        {isLoading &&
          <div className='mt-1 ml-4'>
            <Loading size={24} thickness={180} />
          </div>
        }

        {!isLoading && extraTitleComponent}
      </div>

      {children}
    </div>
  )
}

Page.propTypes = {
  title: PropTypes.string.isRequired,
  showBackButton: PropTypes.bool,
  isLoading: PropTypes.bool,
  containerClassName: PropTypes.string,
  children: PropTypes.node.isRequired,
  extraTitleComponent: PropTypes.node
}

Page.defaultProps = {
  showBackButton: false,
  isLoading: false,
  containerClassName: ''
}

export default Page
