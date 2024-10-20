

let toastVisibilityTime = 0
let toastVisibilityTimer = null

const DEFAULT_VISIBILITY_DURATION = 3 //3s

function showToast(message, duration, type){
    setInfos({message, duration, type})
    setToastVisible(true)
    //Visibility time
    toastVisibilityTime += parseInt(duration)
    if(!toastVisibilityTimer){
        toastVisibilityTimer = setInterval(() => { //Launch the timer
            if(toastVisibilityTime == 0){
                clearInterval(toastVisibilityTimer)
                toastVisibilityTimer = null
                toastVisibilityTime = 0
                setToastVisible(false)
            }
            toastVisibilityTime--
        }, 1000)
    }
}

const Toast = {
    toast: (message, duration = DEFAULT_VISIBILITY_DURATION) => showToast(message, duration, "default"), 
    success: (message, duration = DEFAULT_VISIBILITY_DURATION) => showToast(message, duration, "success"), 
    warning: (message, duration = DEFAULT_VISIBILITY_DURATION) => showToast(message, duration, "warning"), 
    error: (message, duration = DEFAULT_VISIBILITY_DURATION) => showToast(message, duration, "error"),
    info: (message, duration = DEFAULT_VISIBILITY_DURATION) => showToast(message, duration, "info"),
}

export default Toast