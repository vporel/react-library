import { Alert, Box, Fade, Snackbar } from "@mui/material";
import React, { useCallback, useRef, createContext, useState} from "react";

const ToastContext = createContext({})

const DEFAULT_VISIBILITY_DURATION = 4 //4s

export function ToastContextProvider({children}){
    const [toastVisible, setToastVisible] = useState(false)
    const [infos, setInfos] = useState({message: "", duration: 0, type: "default"})

    const showToast = useCallback((message, duration, type) => {
        setInfos({message, duration, type})
        setToastVisible(true)
    }, [])

    return <ToastContext.Provider value={{
        toast: useCallback((message, duration = DEFAULT_VISIBILITY_DURATION) => showToast(message, duration, "default"), []), 
        toastSuccess: useCallback((message, duration = DEFAULT_VISIBILITY_DURATION) => showToast(message, duration, "success"), []), 
        toastWarning: useCallback((message, duration = DEFAULT_VISIBILITY_DURATION) => showToast(message, duration, "warning"), []), 
        toastError: useCallback((message, duration = DEFAULT_VISIBILITY_DURATION) => showToast(message, duration, "error"), []),
        toastInfo: useCallback((message, duration = DEFAULT_VISIBILITY_DURATION) => showToast(message, duration, "info"), []),
    }}>
        {infos.type == "default" 
            ?  <Snackbar open={toastVisible} autoHideDuration={infos.duration*1000} onClose={() => setToastVisible(false)} message={infos.message} anchorOrigin={{vertical: "bottom", horizontal: "center"}} />
            : <Snackbar open={toastVisible} autoHideDuration={infos.duration*1000} onClose={() => setToastVisible(false)} anchorOrigin={{vertical: "bottom", horizontal: "center"}}>
                <Alert 
                    onClose={() => setToastVisible(false)}
                    variant="filled"
                    severity={infos.type}
                    sx={{width: "100%"}}
                >{infos.message}</Alert>
            </Snackbar>
        }

        {children}
    </ToastContext.Provider>
}

export default ToastContext;