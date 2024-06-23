import React from 'react'

export enum ToastType {
  NONE = '',
  SUCCESS = 'success'
}

export type ToastContextType = {
  trigger: (text: string, type?: ToastType) => void
}

export default React.createContext<ToastContextType>({ trigger: () => {} })
