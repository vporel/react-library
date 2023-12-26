/**
 */
import { Image } from "react-bootstrap"
import FlexCenter from "./display/FlexCenter"
import React from "react"

/**
 * @param {*} param0 
 * @returns 
 * @author Vivian NKOUANANG (https://github.com/vporel) <dev.vporel@gmail.com>
 */
export default function Avatar({src, className, size = 35, bordered = true, style, ...props}){ //width = height = size
    return <Image 
        src={src}
        className={"avatar bg-white "+className} 
        roundedCircle 
        style={{transition: "all .3s ease", width: size, height: size, border: bordered ? "2px solid white" : "none", boxShadow: bordered ? "1px 1px 3px rgba(0, 0, 0, .3)" : "none", ...style}} 
        {...props}
    /> 
}

export function IconAvatar({className, size = 35, bordered = true, style, icon, ...props}){
    return <FlexCenter 
        className={"avatar bg-white "+className} 
        style={{transition: "all .3s ease", borderRadius: "50%", width: size, height: size, border: bordered ? "2px solid white" : "none", boxShadow: bordered ? "1px 1px 3px rgba(0, 0, 0, .3)" : "none", ...style}} 
        {...props}
    >{icon}</FlexCenter>
}