import { ReactNode } from 'react'
import { Prop } from '../../../entities/prop'
import { PropBadgesGrid } from '../../PropBadgesGrid'
import TableCell from '../TableCell'

type PropsCellProps = {
  props?: Prop[]
  children?: ReactNode
}

export default function PropsCell({ props, children }: PropsCellProps) {
  return (
    <TableCell className='w-[400px]'>
      {children ?? (props ? <PropBadgesGrid props={props} /> : null)}
    </TableCell>
  )
}
