/**
 * @author Vivian NKOUANANG (https://github.com/vporel) <dev.vporel@gmail.com>
 */
import React, {useEffect, useState } from "react"
import { parseISO } from "date-fns"


const partsDurations = {
    days: 24*60*60, // One day time
    hours: 60*60, 
    minutes: 60,
    seconds: 1
}
function createDateParts(timeDifference){
    let dateParts = {}
    for(let partName in partsDurations){
        if(timeDifference >= partsDurations[partName]){
            dateParts[partName] = Math.floor(timeDifference / partsDurations[partName])
            timeDifference = timeDifference - dateParts[partName] * partsDurations[partName]
        }else
            dateParts[partName] = null
    }
    return dateParts
}
/**
 * Show a count down from the days (months andyears not shown)
 * @component
 * @param {date:Date} param0 
 */
export default function DateCountDown({date, onEnd, className}){
    if(typeof date == "string") date = parseISO(date)
    const [dateParts, setDateParts] = useState(createDateParts(Math.round((date.getTime() - new Date().getTime()) / 1000)))
   
    useEffect(() => {
        if(dateParts.days == null && dateParts.hours == null && dateParts.minutes == null && dateParts.seconds == null){
            console.error("All the date parts are null")
            return
        }
        let timer = setInterval(function(){
            setDateParts(dateParts => {
                let parts = {...dateParts} // Copy the current object
                if(dateParts.seconds === 0 && !dateParts.minutes && !dateParts.hours && !dateParts.days){
                    clearInterval(timer)
                    if(onEnd && typeof onEnd == "function") onEnd()
                    return parts
                }
                parts.seconds--
                if(parts.seconds < 0){
                    if(parts.minutes !== null){
                        parts.seconds = 59
                        parts.minutes--
                        if(parts.minutes < 0){
                            parts.minutes = 59
                            if(parts.hours !== null){
                                parts.hours--
                                if(parts.hours < 0){
                                    parts.hours = 23
                                    if(parts.days !== null){
                                        parts.days--
                                    }
                                }
                            }
                        }
                    }
                }
                return parts
            })
        }, 1000)
        return () => {clearInterval(timer)}
    }, [dateParts])

    return <div className={"date-count-down fs-4 "+className}>
        {dateParts.days && <span className="date-count-down__part days d-inline-block mx-1"><span className="value">{dateParts.days}</span> <label>jour{dateParts.days > 1 ? "s":""}</label></span>} 
        {(dateParts.hours || (dateParts.hours === 0 && dateParts.days)) && <span className="date-count-down__part hours d-inline-block mx-1"><span className="value">{dateParts.hours}</span> <label>heure{dateParts.hours > 1 ? "s":""}</label></span>} 
        {(dateParts.minutes || (dateParts.minutes === 0 && (dateParts.hours || dateParts.days))) && <span className="date-count-down__part minutes d-inline-block mx-1"><span className="value">{dateParts.minutes}</span> <label>minute{dateParts.minutes > 1 ? "s":""}</label></span>} 
        <span className="date-count-down__part d-inline-block mx-1"><span className="value">{dateParts.seconds}</span> <label>seconde{dateParts.seconds > 1 ? "s":""}</label></span>
    </div>
}