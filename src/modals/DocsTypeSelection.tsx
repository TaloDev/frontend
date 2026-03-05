import { useState } from 'react'
import Button from '../components/Button'
import Modal from '../components/Modal'
import RadioGroup from '../components/RadioGroup'

export type DocType = 'api' | 'godot' | 'unity'

type Props = {
  modalState: [boolean, (open: boolean) => void]
  onSelected: (selectedType: DocType) => void
}

export function DocsTypeSelection({ modalState, onSelected }: Props) {
  const [selectedType, setSelectedType] = useState<DocType | null>(null)

  return (
    <Modal
      id='docs-type-selection'
      title='Choose your Talo integration'
      modalState={modalState}
      className='flex flex-col'
    >
      <div className='p-4'>
        <RadioGroup
          name='integration-type'
          containerClassName='flex-col space-x-0! space-y-2'
          options={[
            { label: 'REST API', value: 'api' },
            { label: 'Godot plugin', value: 'godot' },
            { label: 'Unity package', value: 'unity' },
          ]}
          onChange={setSelectedType}
          value={selectedType}
        />
      </div>

      <div className='border-t border-gray-200'>
        <div className='p-4 text-right'>
          <Button
            disabled={!selectedType}
            className='w-auto!'
            onClick={() => {
              if (selectedType) {
                onSelected(selectedType)
              }
            }}
          >
            Save selection
          </Button>
        </div>
      </div>
    </Modal>
  )
}
