import React, { useCallback, useState } from "react"
import { range } from "@vporel/js/array"
import { Box } from "@mui/material";
import OutlineStarIcon from "@mui/icons-material/StarOutline"
import FilledStarIcon from "@mui/icons-material/Star"

export default function RatingsChoices({rating, onRate}){
    const [messageVisible, setMessageVisible] = useState(false)
    const handleRate = useCallback(r => {
        onRate(r)
        setMessageVisible(true)
    }, [onRate])
    
    return <Box>
        <Box display="flex" justifyContent="center" alignItems="center" textAlign="center" gap={1}>
            {range(1, 5).map(i => <Box
                key={i}  
                onClick={() => handleRate(i)}
                display="flex" justifyContent="center" alignItems="center"
                sx={{
                    width: "40px", height:"40px", 
                    fontSize: "2rem", 
                    transition: "all .2s ease", 
                    cursor: "pointer"
                }}
            >{i <= rating ? <FilledStarIcon sx={{color: "yellow"}}/> : <OutlineStarIcon />}</Box>)}
        </Box>
        {messageVisible && <div className="mt-3"><span className="badge bg-primary">Merci pour votre avis</span></div>}
    </Box>
}