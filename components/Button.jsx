/**
 * @author Vivian NKOUANANG (https://github.com/vporel) <dev.vporel@gmail.com>
 */
import { classNames } from '@vporel/js/dom'
import Loader from './Loader'
import React from "react"

export function ButtonPrimary ({ children, ...props }) {
  return (
    <Button btnClass='primary' {...props}>
      {children}
    </Button>
  )
}

export function ButtonSecondary ({ children, ...props }) {
  return (
    <Button btnClass='secondary' {...props}>
      {children}
    </Button>
  )
}

export function ButtonLight ({ children, ...props }) {
  return (
    <Button btnClass='light' {...props}>
      {children}
    </Button>
  )
}

export function ButtonLink ({ children, ...props }) {
  return (
    <Button btnClass='link' {...props}>
      {children}
    </Button>
  )
}

export function ButtonDanger ({ children, ...props }) {
  return (
    <Button btnClass='danger' {...props}>
      {children}
    </Button>
  )
}

/**
 *
 * @param {*} children
 * @param {string} className
 * @param {string} iconName Only fontawesome
 * @param {string} size
 * @param {boolean} loading
 * @param {Object} props
 * @return {*}
 */
export function Button ({ children, type="button", btnClass='', className = '', outline = false, loading = false, disabled=false, size, iconName = null, ...props }) {
  className = classNames('btn', 'btn-' + (outline ? 'outline-' : '') + btnClass, size && `btn-${size}`, 'd-flex justify-content-center align-items-center gap-1', className)
  if(iconName && !iconName.startsWith("far ") && !iconName.startsWith("fab ")) iconName = "fas fa-"+iconName
  
  return (
    <button type={type} className={className} disabled={loading || disabled} {...props}>
      {loading 
        ? <Loader className='icon py-0' size={30} />
        : (iconName != null && <i className={iconName}></i>)
      }
      {children}
    </button>
  )
}
