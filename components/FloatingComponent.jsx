import { useToggle } from "../hooks"
import FloatingComponentOpener from "./FloatingComponentOpener"
import React from "react"

export default function FloatingComponent({openerProps, openerBadgeProps, children}){
    const [visible, toggleVisible] = useToggle(false)

    return <Fragment>
        <FloatingComponentOpener {...openerProps} badgeProps={openerBadgeProps} onClick={toggleVisible}/>
        {children(visible, toggleVisible)}
    </Fragment>
}