
import React, { useCallback, useRef, useState } from "react"
import { Box, Grid, InputAdornment, TextField, Typography } from "@mui/material"
import Loader from "./Loader"
import { useBooleanState } from "../hooks"


/**
 * @author Vivian NKOUANANG (https://github.com/vporel) <dev.vporel@gmail.com>
 */
export default function ChatMessageForm({
    multiline = true, defaultValue, onSubmit, onSelectFile, disabled, placeholder, className, variant = "outlined", 
    bordered = true, attachments, inputProps = {}
}){
    const [value, setValue] = useState("")
    const [sending, setSending] = useState(false)
    const submit = useCallback(async () => {
        if(disabled || sending || value.trim() == "") return; 
        setSending(true)
        if(await onSubmit(value)) setValue("")
        setSending(false)    
    }, [value, disabled, sending])
    const [attachmentsVisible, showAttachments, hideAttachments] = useBooleanState(false)

    return (
        <Box className="chat-message-form">
            <TextField multiline={multiline} maxRows={4} fullWidth placeholder={placeholder} disabled={disabled || sending} defaultValue={defaultValue}
                value={value} 
                variant={variant}
                onChange={e => setValue(e.target.value)}
                className={"w-100 "+className}
                sx={bordered ? {} : {"& fieldset": { border: 'none' },}}
                InputProps={{
                    startAdornment: (attachments && attachments.length > 0) && <InputAdornment position="start">
                        <i className="fas fa-paperclip hover:color-primary cursor-default" onClick={showAttachments}/>
                    </InputAdornment>,
                    endAdornment: <InputAdornment position="end" className="hover:color-primary" onClick={submit}>
                    {sending ? <Loader /> : <i className="fas fa-paper-plane cursor-default"></i>}</InputAdornment>,
                    ...inputProps
                }} 
            />
            
        </Box>
    )
}