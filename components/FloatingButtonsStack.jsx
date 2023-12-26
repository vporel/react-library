import { Box, Fab } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'

/**
 * alignment = left|right
 * @param {*} param0 
 * @returns 
 */
export default function FloatingButtonsStack({alignment = "right", left = 10, right = 10, bottom = 10, zIndex = 10, children}){
    const [opened, setOpened] = useState(false)
    const stackRef = useRef(null)

    useEffect(() => {
        const clickListener = e => {setOpened(false)}
        for(const el of stackRef.current.children) el.addEventListener('click', clickListener)
        return () => {
            for(const el of stackRef.current.children) el.removeEventListener('click', clickListener)
        }
    }, [stackRef])

    return <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "end",
        gap: 1,
        position: "fixed",
        right: alignment == "right" ? right : "auto",
        left: alignment == "left" ? left : "auto",
        bottom,
        zIndex
    }}>
        <Box ref={stackRef} sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
            gap: 1,
            opacity: opened ? 1 : 0,
            maxHeight: opened ? "100%" : 0,
            maxWidth: opened ? "100%" : 0,
            visibility: opened ? "visible" : "hidden",
            transition: "all .3s ease"
        }}>
            {children}
        </Box>
        <Fab color="primary" onClick={() => setOpened(v => !v)}><i className="fas fa-plus fs-4" style={{transition: "all .3s ease", transform: opened ? "rotate(405deg)" : ""}}/></Fab>
    </Box>
}