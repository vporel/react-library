import { useToggle } from "../hooks"
import FlexCenter from "./display/FlexCenter"
import React, { useEffect, useRef } from "react"

/**
 * To add in a component a set of hidden options
 * The options are visible when the opener is clicked
 * 
 * @param {*} param0 
 * @returns 
 */
export default function ExtraOptions({openerIcon, openerStyle, children, ...props}){
    const [visible, toggleVisible] = useToggle(false)
    const containerRef = useRef(null)

    useEffect(() => {
        const containerClickHandler = e => e.stopPropagation()
        const documentClickHandler = e => visible ? toggleVisible() : null 
        containerRef.current.addEventListener('click', containerClickHandler)
        document.addEventListener('click', documentClickHandler)

        return () => {
            containerRef.current.removeEventListener('click', containerClickHandler)
            document.removeEventListener('click', documentClickHandler)
        }
    }, [visible])

    return <div className="extra-options" {...props}>
        <span class="extra-options__opener" style={openerStyle} onClick={e => {e.stopPropagation(); toggleVisible() }}>{openerIcon ? openerIcon : <i class="fas fa-ellipsis-v"></i>}</span>
        <div className="extra-options__container" hidden={!visible} ref={containerRef}>
            {children}
        </div>
    </div>
}

/**
 * The Component can be a link/button component
 * @param {*} param0 
 * @returns 
 */
ExtraOptions.Option = ({onClick, icon, label, Component, className, children, ...props}) => {
    if(!Component) Component = 'button'

    return <Component onClick={onClick} className={`extra-options__option ${className}`} {...props}>{icon && <FlexCenter className="icon">{icon}</FlexCenter>} {label ? label : children}</Component>
}