type HeadlineStatProps = {
  title: string
  stat: string | number
  className?: string
}

const HeadlineStat = (props: HeadlineStatProps) => {
  return (
    <div className={`rounded border-2 border-gray-700 w-full text-center md:text-left ${props.className ?? ''}`}>
      <div className='p-4 bg-gray-700'>
        <h3 className='text-lg font-bold'>{props.title}</h3>
      </div>

      <div className='p-4'>
        <p className='text-4xl md:text-6xl'>{props.stat.toLocaleString()}</p>
      </div>
    </div>
  )
}

export default HeadlineStat
