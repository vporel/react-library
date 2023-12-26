import { classNames } from "@vporel/js/dom";
import React from "react"

export default function FlexCenter({className, children, ...props}){
    return <div className={classNames("d-flex justify-content-center align-items-center gap-2", className)} {...props}>
        {children}
    </div>
}