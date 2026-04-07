import { IconFileUpload, IconTrash } from '@tabler/icons-react'
import clsx from 'clsx'
import { ChangeEvent, DragEvent, useId, useRef, useState } from 'react'
import { focusStyle } from '../styles/theme'

type FileUploadProps = {
  accept?: string
  label?: string
  onChange: (file: File) => void
  onClear?: () => void
}

export default function FileUpload({ accept, label, onChange, onClear }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setFileName(file.name)
    onChange(file)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault()
    setFileName(null)

    if (inputRef.current) {
      inputRef.current.value = ''
    }

    onClear?.()
  }

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
      e.target.value = ''
    }
  }

  const isFileAccepted = (file: File): boolean => {
    if (!accept) {
      return true
    }

    return accept.split(',').some((token) => {
      const t = token.trim()

      if (t.startsWith('.')) {
        return file.name.toLowerCase().endsWith(t.toLowerCase())
      }

      if (t.endsWith('/*')) {
        return file.type.startsWith(t.slice(0, -1))
      }

      return file.type === t
    })
  }

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file && isFileAccepted(file)) {
      handleFile(file)
    }
  }

  const onDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }

  const id = useId()
  const inputId = `file-upload-${id}`

  return (
    <div>
      {label && (
        <p className='mb-2 font-semibold' aria-hidden='true'>
          {label}
        </p>
      )}
      <label
        htmlFor={inputId}
        className={clsx(
          'flex cursor-pointer flex-col items-center justify-center space-y-2 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-indigo-400 hover:bg-indigo-50',
          focusStyle,
          {
            'border-indigo-400 bg-indigo-50': isDragging,
          },
        )}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        {fileName ? (
          <>
            <p className='text-sm font-medium'>{fileName}</p>
            <button
              type='button'
              aria-label='Clear file'
              className='text-xs text-indigo-600 hover:text-indigo-800'
              onClick={handleClear}
            >
              <IconTrash className='-mt-1 inline-block' size={16} aria-hidden='true' />
              <span className='ml-1'>Clear file</span>
            </button>
          </>
        ) : (
          <>
            <p className='text-sm text-gray-700'>
              <IconFileUpload className='-mt-1 inline-block' size={24} aria-hidden='true' />
              <span className='ml-1'>Drop a file here or click to browse</span>
            </p>
            {accept && <p className='text-xs text-gray-500'>{accept.toUpperCase()}</p>}
          </>
        )}
      </label>
      <input
        ref={inputRef}
        id={inputId}
        type='file'
        accept={accept}
        className='sr-only'
        onChange={onInputChange}
      />
    </div>
  )
}
