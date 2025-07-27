import React, { Children } from 'react'

export function Slot({ children }: { children?: React.ReactNode }) {
  if (Children.count(children) !== 1) {
    throw new Error('Slot must have exactly one child')
  }
  if (React.isValidElement(children)) {
    return React.cloneElement(children)
  }
}
