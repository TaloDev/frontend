import { ReactElement, ReactNode, useMemo } from 'react'
import { isMetaProp } from '../constants/metaProps'
import { Prop } from '../entities/prop'
import clsx from 'clsx'
import Tippy from '@tippyjs/react'
import { focusStyle } from '../styles/theme'

type Props = {
  props: Prop[]
  icon?: ReactElement
  onClick?: (prop: Prop) => void
  devBuild?: boolean
  buttonTitle?: string
  className?: string
  contentRenderer?: (prop: Prop) => ReactNode
}

function defaultContentRenderer({ key, value }: Prop) {
  return `${key} = ${value}`
}

export function PropBadges({
  props,
  icon: Icon,
  devBuild, onClick,
  buttonTitle,
  className,
  contentRenderer = defaultContentRenderer
}: Props) {
  const sortedProps = useMemo(() => {
    return props
      .filter((prop) => !isMetaProp(prop))
      .sort((a, b) => a.key.localeCompare(b.key))
  }, [props])

  return (
    <div className={clsx('gap-2', className)}>
      {sortedProps.map(({ key, value }) => (
        <span
          key={`${key}-${value}`}
          className='bg-gray-900 rounded text-xs flex w-fit'
        >
          <code className='align-middle inline-block p-2 break-all'>{contentRenderer({ key, value })}</code>
          {onClick && (
            <Tippy content={<p>{buttonTitle}</p>}>
              <button
                type='button'
                className={clsx('grow px-2 bg-indigo-900 rounded-r', focusStyle, { 'bg-orange-900': devBuild })}
                onClick={() => onClick({ key, value })}
                aria-label={buttonTitle}
              >
                {Icon}
              </button>
            </Tippy>
          )}
        </span>
      ))}
    </div>
  )
}
