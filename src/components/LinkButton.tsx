import { linkStyle, focusStyle } from '../styles/theme'

type LinkButtonProps = {
  onClick: (...args: unknown[]) => unknown
  children: any
}

const LinkButton = (props: LinkButtonProps) => {
  return (
    <button
      type='button'
      className={`${linkStyle} ${focusStyle}`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}

export default LinkButton
