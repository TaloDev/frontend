import ReactSelect, {
  components,
  Props as ReactSelectProps,
  OptionProps,
  GroupBase,
  StylesConfig,
  SingleValue,
  SelectInstance,
} from 'react-select'

export type SelectOption<T> = {
  label: string | React.ReactNode
  value: T
  desc?: string
}

function Option<T>(props: OptionProps<T, boolean, GroupBase<T>>) {
  const { label, desc } = props.data as SelectOption<T>

  return (
    <components.Option {...props}>
      <p className='font-medium'>{label}</p>
      {desc && <p className='mt-2 text-sm'>{desc}</p>}
    </components.Option>
  )
}

type SelectProps<T> = {
  innerRef?: React.Ref<SelectInstance<SelectOption<T>, boolean, GroupBase<SelectOption<T>>>>
  onChange: (option: SelectOption<T> | null) => void
} & Omit<ReactSelectProps<SelectOption<T>, boolean, GroupBase<SelectOption<T>>>, 'onChange'>

function Select<T>({ innerRef, onChange, ...props }: SelectProps<T>) {
  const styles: StylesConfig<SelectOption<T>, boolean, GroupBase<SelectOption<T>>> = {
    control: (provided, state) => ({
      ...provided,
      border: `1px solid ${state.isFocused ? 'transparent' : 'rgba(0, 0, 0, 0.3)'} !important`,
      boxShadow: state.isFocused
        ? 'rgb(255, 255, 255) 0px 0px 0px 0px, rgb(236, 72, 153) 0px 0px 0px 3px, rgba(0, 0, 0, 0) 0px 0px 0px 0px'
        : 'none',
      paddingTop: '2px',
      paddingBottom: '2px',
      transition: 'none',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#6366F1' : provided.backgroundColor,
      color: state.isSelected ? '#FFF' : '#000',
      ':hover': {
        // backgroundColor: !state.isSelected ? '' : '#E0E7FF',
        color: state.isSelected ? '#FFF' : '#000',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#000',
      padding: '0px',
    }),
  }

  return (
    <ReactSelect
      {...props}
      ref={innerRef}
      components={{ Option }}
      onChange={(option) => onChange(option as SingleValue<SelectOption<T>>)}
      styles={styles}
    />
  )
}

export default Select
