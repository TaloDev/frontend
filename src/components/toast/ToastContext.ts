import React from 'react'

export enum ToastType {
  NONE = '',
  SUCCESS = 'success',
  ERROR = 'error',
}

export type ToastContextType = {
  trigger: (text: string, type?: ToastType) => void
}

export default React.createContext<ToastContextType>({ trigger: () => {} })
