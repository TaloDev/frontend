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
    const grouped = new Map<string, Prop[]>()

    props
      .filter((prop) => !isMetaProp(prop))
      .forEach((prop) => {
        grouped.set(prop.key, [...(grouped.get(prop.key) ?? []), prop])
      })

    return [...grouped.entries()]
      .map(([key, entries]) => ({
        key,
        value: entries.map((entry) => entry.value).join(', '),
        firstValue: entries[0].value,
      }))
      .filter((prop) => prop.key !== '')
      .sort((a, b) => a.key.localeCompare(b.key))
  }, [props])

  return (
    <div className={clsx('gap-2', className)}>
      {sortedProps.map(({ key, value, firstValue }) => (
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
                onClick={() => onClick({ key, value: firstValue })}
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
