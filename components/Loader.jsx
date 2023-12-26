import FlexCenter from "@vporel/js/components/FlexCenter"
import { CircularProgress } from "@mui/material"
import React from "react"

export default function Loader({className, text, size = 35, color = "primary"}){
    return <FlexCenter className={"gap-2 flex-column "+className}>
        <CircularProgress size={size} color={color}/>
        {text && <div>{text}</div>}
    </FlexCenter>
}