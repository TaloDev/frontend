// Spinner from unmaintained package: https://github.com/adexin/spinners-react
//
import colors from 'tailwindcss/colors'

type LoadingProps = {
  colour?: string
  size?: number
  thickness?: number
}

export default function Loading({
  size = 80,
  thickness = 160
}: LoadingProps) {
  const speed = 100
  const strokeWidth = 4 * (thickness / 100)

  return (
    <span data-testid='loading'>
      <svg fill='none' width={size} color='white' viewBox='0 0 66 66'>
        <circle
          cx='33'
          cy='33'
          fill='none'
          r='28'
          stroke={colors.indigo[500]}
          strokeWidth={strokeWidth}
        />
        <circle
          cx='33'
          cy='33'
          fill='none'
          r='28'
          stroke='currentColor'
          strokeDasharray='40, 134'
          strokeDashoffset='325'
          strokeLinecap='round'
          strokeWidth={strokeWidth}
          style={{ animation: `spinners-react-circular-fixed ${140 / speed}s linear infinite` }}
        />
      </svg>
    </span>
  )
}
