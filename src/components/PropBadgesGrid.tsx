import { Prop } from '../entities/prop'
import { PropBadges } from './PropBadges'

export function PropBadgesGrid({ props }: { props: Prop[] }) {
  return (
    <PropBadges
      props={props}
      className="grid grid-cols-[repeat(auto-fill,minmax(184px,1fr))]"
    />
  )
}
