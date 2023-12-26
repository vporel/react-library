import { ButtonPrimary } from "./Button"
import React, { useMemo } from "react"

export default function FloatingComponentOpener({iconName, bottom = 15,  right = 15, badgeProps, relative, onClick}){
    const _badgeProps = useMemo(() => ({visible: false, className: "", value: "", ...badgeProps}), [badgeProps])

    return <ButtonPrimary className="px-2 fs-4" iconName={iconName} onClick={onClick} style={{position: relative ? "static" : "fixed", bottom, right, zIndex: 5}}>
        {_badgeProps.visible && <span className={"fs-5 bg-white text-primary rounded rounded-3 px-2 "+_badgeProps.className} style={{position: "absolute", top: "-10px", right: "-8px"}}>{_badgeProps.value}</span>}
    </ButtonPrimary>
}