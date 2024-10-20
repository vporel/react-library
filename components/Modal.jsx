import React from "react"
import { Box, IconButton, Modal as MuiModal } from "@mui/material"
import { Close as CloseIcon } from "@mui/icons-material"


/**
 * Mui modal with a predefined style
 * @param {*} param0 
 * @returns 
 */
export default function Modal({open, onClose, sx, children, closeButton = true}){

    return <MuiModal open={open} onClose={onClose} >
        <Box sx={{
            outline: "none",
            background: "white", borderRadius: "10px", p: 2, boxShadow: "0 0 5px rgba(0, 0, 0, .3)",
            position: 'absolute',
            top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            ...sx
        }}>
            {closeButton && <IconButton onClick={onClose} sx={{position: "absolute", top: 2, right: 2}}><CloseIcon /></IconButton>}
            {children}
        </Box>
    </MuiModal>
    
}