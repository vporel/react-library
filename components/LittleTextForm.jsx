
import React, { useCallback, useRef, useState } from "react"
import { InputAdornment, TextField } from "@mui/material"
import Loader from "./Loader"

/**
 * @author Vivian NKOUANANG (https://github.com/vporel) <dev.vporel@gmail.com>
 */
export default function LittleTextForm({multiline = true, defaultValue, onSubmit, disabled, placeholder, className, variant = "outlined", bordered = true, InputProps = {}}){
    const [value, setValue] = useState("")
    const [sending, setSending] = useState(false)
    const submit = useCallback(async () => {
        if(disabled || sending || value.trim() == "") return; 
        setSending(true)
        if(await onSubmit(value)) setValue("")
        setSending(false)    
    }, [value, disabled, sending])
    return (
        <TextField multiline={multiline} maxRows={4} fullWidth placeholder={placeholder} disabled={disabled || sending} defaultValue={defaultValue}
            value={value} 
            variant={variant}
            onChange={e => setValue(e.target.value)}
            onKeypress={e => {
                if(multiline) return 
                if(e.key == "Enter") submit()
            }}
            className={className}
            sx={bordered ? {} : {"& fieldset": { border: 'none' },}}
            InputProps={{
                endAdornment: <InputAdornment position="end" className="cursor-pointer hover:color-primary" onClick={submit}>
                {sending ? <Loader /> : <i className="fas fa-paper-plane"></i>}</InputAdornment>,
                ...InputProps
            }} 
        />
    )
}