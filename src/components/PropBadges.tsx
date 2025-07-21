import { ReactElement } from 'react'
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
}

export function PropBadges({ props, icon: Icon, devBuild, onClick, buttonTitle }: Props) {
  return props.filter((prop) => !isMetaProp(prop)).map(({ key, value }) => (
    <span
      key={`${key}-${value}`}
      className='bg-gray-900 rounded mr-2 mb-2 text-xs inline-flex'
    >
      <code className='align-middle inline-block p-2'>{key} = {value}</code>
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
  ))
}
