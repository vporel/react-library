import React, { useCallback, useEffect, useState } from "react";

export default function AddToHomeScreen({icon, appName}){
    const [visible, setVisible] = useState(false)
    const [promptEvent, setPromptEvent] = useState(null)

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (promptEvent) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            promptEvent.preventDefault();
            setVisible(true)
            setPromptEvent(promptEvent)
        });
    }, [])

    const showPrompt = useCallback(() => {
        if(!promptEvent) return
        setVisible(false)
        promptEvent.prompt(); // Show the prompt
        promptEvent.userChoice.then((choiceResult) => { // Wait for the user to respond to the prompt
            if(choiceResult.outcome === 'accepted') {
                //User accepted the A2HS prompt
            } else {
                // User dismissed the A2HS prompt
            }
        });
    }, [promptEvent, setVisible])

    return visible
        ? <div id="add-to-home-screen">
            <img src={icon} alt="" />
            <label className="fs-5">{appName}</label>
            <button class="btn btn-outline-primary py-2 px-3" onClick={showPrompt}>
                <i class="fas fa-download"></i> Installer
            </button>
            <i className="fas fa-times" onClick={() => setVisible(false)}></i>
        </div>
        : ""
}
