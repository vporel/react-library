import { ButtonLight } from "./Button"
import React, { useCallback, useEffect, useState } from "react"
import _ from "../translator"
import { Spinner } from "react-bootstrap"

export default function AudioRecorder({onAudioRecorded, onError, reset, onReset}){
    const [recording, setRecording] = useState(false)
    const [paused, setPaused] = useState(false)
    const [mediaRecorder, setMediaRecorder] = useState(null)
    const [chunks, setChunks] = useState([])
    const [audioSrc, setAudioSrc] = useState(null)

    //Handle reset
    useEffect(() => {
        //When the value of reset changes (it can be done by the parent component)
        if(reset){
            setAudioSrc(null)
            if(onReset) onReset()
        }
    }, [reset, onReset])
    
    const start = useCallback(() => {
        setPaused(false)
        if(!navigator.mediaDevices){
            onError(_("Audio recording by your browser", "Enregistrement audio non supporté par votre navigateur"))
            return;
        }
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const mediaRecorder = new MediaRecorder(stream)
                mediaRecorder.ondataavailable = event => { //save the recorded the data
                    setChunks(chunks => [...chunks, event.data]);
                }
                mediaRecorder.start();  //start recording
                setMediaRecorder(mediaRecorder)
                setRecording(true)
            })
            .catch(error => {
                onError(_("Error accessing the microphone", "Erreur d'accès au microphone"));
            });
    }, [setRecording, setPaused, setMediaRecorder, onError])

    const pause = useCallback(() => {
        mediaRecorder.pause()
        setRecording(false)
        setPaused(true)
    }, [mediaRecorder, setRecording, setPaused])

    const resume = useCallback(() => {
        mediaRecorder.resume()
        setRecording(true)
        setPaused(false)
    }, [mediaRecorder, setRecording, setPaused])

    const stop = useCallback(() => {
        setRecording(false)
        setPaused(false)
        mediaRecorder.stop();
        setTimeout(() => {
            setChunks(chunks => {
                const blob = new Blob(chunks, { type: 'audio/wav' }); //Blob from chunks
                setAudioSrc(URL.createObjectURL(blob))
                onAudioRecorded(blob)
                return []
            })
        }, 200);    //When for the data to be retrived
    }, [mediaRecorder, onAudioRecorded, setRecording, setPaused, setAudioSrc])
    
    return <div className="mt-2">
        {audioSrc && <audio controls src={audioSrc} className="w-100"></audio>}
        <div className="bg-rgb240 d-flex gap-2 align-items-center rounded rounded-2">
            {!recording && !paused
                ? <ButtonLight iconName="microphone" onClick={start}/>
                : <ButtonLight iconName={recording ? "pause" : "play"} onClick={() => {if(recording) pause(); else resume()}} />
            }
            <div className="w-100">
                {recording 
                    ? <Spinner animation="grow" />
                    : (!paused ? _("Click to record", "Cliquer pour enregistrer") : _("Click to continue", "Cliquer pour continuer"))
                }
            </div>
            {(recording || paused) && <ButtonLight iconName="stop" onClick={stop}/>}
        </div>
    </div>
}