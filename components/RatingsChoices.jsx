import React, { useCallback, useState } from "react"
import { range } from "../array"

export default function RatingsChoices({rating, onRate}){
    const [messageVisible, setMessageVisible] = useState(false)
    const handleRate = useCallback(r => {
        onRate(r)
        setMessageVisible(true)
    }, [onRate])
    return <div className="ratings-choices-container">
        <div className="ratings-choices">
            {range(1, 5).map(i => <span key={i} className={"choice" + (i <= rating ? " filled" : "")} onClick={() => handleRate(i)}><i className="fas fa-star"></i></span>)}
        </div>
        {messageVisible && <div className="mt-3"><span className="badge bg-primary">Merci pour votre avis</span></div>}
    </div>
}