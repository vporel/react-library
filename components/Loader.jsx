import { Box, CircularProgress } from "@mui/material"
import React from "react"

export default function Loader({size = 35, color = "primary", children, ...props}){
    return <Box display="flex" justifyContent="center" alignItems="center" gap={1} flexDirection="column" {...props}>
        <CircularProgress size={size} sx={{
            color: theme => ["primary", "secondary"].includes(color) ? theme.palette[color].main : color
        }}/>
        {children && <Box>{children}</Box>}
    </Box>
}