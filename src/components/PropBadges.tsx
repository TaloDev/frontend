import Tippy from '@tippyjs/react'
import clsx from 'clsx'
import { ReactElement, ReactNode, useMemo } from 'react'
import { isMetaProp } from '../constants/metaProps'
import { Prop } from '../entities/prop'
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
  devBuild,
  onClick,
  buttonTitle,
  className,
  contentRenderer = defaultContentRenderer,
}: Props) {
  const sortedProps = useMemo(() => {
    return props.filter((prop) => !isMetaProp(prop)).sort((a, b) => a.key.localeCompare(b.key))
  }, [props])

  return (
    <div className={clsx('gap-2', className)}>
      {sortedProps.map(({ key, value }) => (
        <span key={`${key}-${value}`} className='flex w-fit rounded bg-gray-900 text-xs'>
          <code className='inline-block p-2 align-middle break-all'>
            {contentRenderer({ key, value })}
          </code>
          {onClick && (
            <Tippy content={<p>{buttonTitle}</p>}>
              <button
                type='button'
                className={clsx('grow rounded-r bg-indigo-900 px-2', focusStyle, {
                  'bg-orange-900': devBuild,
                })}
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
