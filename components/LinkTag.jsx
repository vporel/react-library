import { Link, useLocation } from "react-router-dom"
import React from "react"

/**
 * Return either a <a> or a <Link> tag depending on wheter there is a router context or not
 */
export default function LinkTag({href, children, ...props}){
    let routerContextExists = true
    try{ useLocation() }
    catch{ routerContextExists = false }
    return routerContextExists ? <Link to={href} {...props}>{children}</Link> : <a href={href} {...props}>{children}</a>
}