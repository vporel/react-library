import React, { useCallback, useRef, createContext} from "react";
import $ from "jquery"

const ToastContext = createContext({})


const TYPES = ["normal", "success", "warning", "error"]
let toastVisibilityTime = 0
let toastVisibilityTimer = null

export function ToastContextProvider({children}){
    const boxRef = useRef(null)
    const _toast = useCallback((message, duration = 3, type) => {
        const $box = $(boxRef.current)
        $box.text(message)
        $box.removeClass(TYPES.join(" "))
        $box.addClass(type)
        //Visibility time
        toastVisibilityTime += parseInt(duration)
        $box.fadeIn(500)
        if(!toastVisibilityTimer){
            toastVisibilityTimer = setInterval(() => {
                if(toastVisibilityTime == 0){
                    clearInterval(toastVisibilityTimer)
                    toastVisibilityTimer = null
                    toastVisibilityTime = 0
                    $box.fadeOut(500)
                }
                toastVisibilityTime--
            }, 1000)
        }
    }, [boxRef])

    return <ToastContext.Provider value={{
        toast: (message, duration = 3) => _toast(message, duration, "normal"), 
        toastSuccess: (message, duration = 3) => _toast(message, duration, "success"), 
        toastWarning: (message, duration = 3) => _toast(message, duration, "warning"), 
        toastError: (message, duration = 3) => _toast(message, duration, "error"),
        toastInfo: (message, duration = 3) => _toast(message, duration, "info"),
    }}>
        <div ref={boxRef} className="toast-box"></div>
        {children}
    </ToastContext.Provider>
}

export default ToastContext;