import PropTypes from 'prop-types'
import clsx from 'clsx'
import Title from './Title'
import Loading from './Loading'
import GlobalBanners from './GlobalBanners'

function Page({ title, showBackButton, isLoading, containerClassName, extraTitleComponent, children, secondaryNav }) {
  return (
    <div className='space-y-8'>
      {secondaryNav}

      <GlobalBanners />

      <div className={clsx('space-y-8', containerClassName)}>
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
    </div>
  )
}

Page.propTypes = {
  title: PropTypes.string.isRequired,
  showBackButton: PropTypes.bool,
  isLoading: PropTypes.bool,
  containerClassName: PropTypes.string,
  children: PropTypes.node.isRequired,
  extraTitleComponent: PropTypes.node,
  secondaryNav: PropTypes.node
}

Page.defaultProps = {
  showBackButton: false,
  isLoading: false,
  containerClassName: ''
}

export default Page
