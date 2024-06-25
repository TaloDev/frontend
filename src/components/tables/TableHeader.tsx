type TableHeaderProps = {
  columns: string[]
}

const TableHeader = (props: TableHeaderProps) => {
  return (
    <thead className='bg-white text-black font-semibold'>
      <tr>
        {props.columns.map((col, idx) => (
          <th key={idx} className='p-4 text-left'>{col}</th>
        ))}
      </tr>
    </thead>
  )
}

export default TableHeader
