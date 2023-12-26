
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import _ from "../translator"
import $ from 'jquery'
import { FilesUploadBox } from "./FilesUploadBox"
import { ButtonLight, ButtonPrimary } from "./Button"
import { useBooleanState, useToggle } from "../hooks"
import AudioRecorder from "./AudioRecorder"
import ToastContext from "../contexts/ToastContext"
import DialogBoxesContext from "../contexts/DialogBoxesContext"
import { Box, Grid, InputAdornment, TextField, Typography } from "@mui/material"
import Loader from "./Loader"


const attachmentsTypes = {
    document: {label: "Document", icon: <i className="fas fa-file" />, extensions: []},
    image: {label: "Image", icon: <i className="fas fa-image" />, extensions: [".jpeg", ".jpg", ".png", ".gif", ".webp"]},
    video: {label: "Vidéo", icon: <i className="fas fa-video" />, extensions: [".mp4", ".avi", ".mov"]},
    audio: {label: "Audio", icon: <i className="fas fa-headphones" />, extensions: [".mp3", ".wav", ".webm"]}
}

/**
 * onSelectFile : (files, type) => void
 * @param {*} param0 
 * @returns 
 */
function Attachments({attachments, onHide, onSelectType, minimized}){

    return <Box className="attachments">
        <Grid container spacing={1}>
            {Object.keys(attachmentsTypes).map(type => {
                if(!attachments.includes(type)) return null
                const att = attachmentsTypes[type]
                return <Grid item key={type} xs={minimized ? 4 : 3} onClick={() => {onHide(); onSelectType(type)}} className="d-flex flex-column justify-content-center align-items-center item">
                    <Box className="icon">{att.icon}</Box>
                    <Typography className="label">{att.label}</Typography>
                </Grid>
            })}
        </Grid>
    </Box>
}

/**
 * Component with a message-form structure
 * The onSubmit function takes parameters (text, files) and should return true so that the form stop the submitting process
 * attachments = array (image, document, audio, video)
 * @param {*} param0 
 * @returns 
 * @author Vivian NKOUANANG (https://github.com/vporel) <dev.vporel@gmail.com>
 */
export function MessageForm({
    multiline, onSubmit, submitBtnText=_('Send'), minLength, InputProps, attachments, audioRecorder,
    filesUploadBoxProps, minimized
}){
    const _filesUploadBoxProps = useMemo(() => ({autoOpenDialog: false, ...filesUploadBoxProps}), [filesUploadBoxProps])
    const { toastWarning } = useContext(ToastContext)
    const { alertDialog } = useContext(DialogBoxesContext)
    const [text, setText] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [filesBoxVisible, showFilesBox, hideFilesBox] = useBooleanState(false)
    const [audioRecorderVisible, showAudioRecorder, hideAudioRecorder, toggleAudioRecorder] = useBooleanState(false)
    const [files, setFiles] = useState([])
    const [resetFiles, setResetFiles] = useState(false)
    const [resetAudio, setResetAudio] = useState(false)
    const [audioFile, setAudioFile] = useState(null)
    const [attachmentsVisible, showAttachments, hideAttachments] = useBooleanState(false)
    const [filesExtensions, setFilesExtensions] = useState([])

    const submit = useCallback(async () => {
        if(text == "" && !audioFile && files.length == 0) return 
        if(text != "" && minLength && text.length < minLength) return toastWarning(`Au moins ${minLength} caractères`)
        setSubmitting(true)
        const sentFiles = [...files]
        if(audioFile) sentFiles.push(audioFile)
        if(await onSubmit(text, sentFiles)){
            //Reset
            setText("")
            setFiles([])
            setAudioFile(null)
            hideAudioRecorder()
            hideFilesBox()
        }
        setSubmitting(false)

    }, [text, files, audioFile, minLength, toastWarning])

    const onSelectFilesType = useCallback(type => {
        setFilesExtensions(attachmentsTypes[type].extensions)
        showFilesBox()
    }, [])

    return <form className={"message-form "+(multiline ? " multiline " : "")+(minimized ? "minimized" : "")}>
        <TextField 
            multiline={multiline}
            fullWidth disabled={submitting} placeholder={_("Write here")} onChange={e => setText(e.target.value)} value={text} 
            onKeypress={e => {
                if(multiline) return 
                if(e.key == "Enter") submit()
            }}
            rows={6}
            InputProps={{
                startAdornment: (attachments && attachments.length > 0) && <InputAdornment position="start">
                    <i className="fas fa-paperclip hover:color-primary cursor-default" onClick={showAttachments}/>
                </InputAdornment>,
                endAdornment: !multiline && <InputAdornment position="end" className="hover:color-primary" onClick={submit}>
                    {submitting ? <Loader /> : <i className="fas fa-paper-plane cursor-default"></i>}
                </InputAdornment>,
                ...InputProps
            }}
        />
        {audioRecorder && audioRecorderVisible && <AudioRecorder 
            onAudioRecorded={setAudioFile} onError={error => alertDialog("", error)} reset={resetAudio}
            onReset={() => setResetAudio(false)} 
        />}
        {filesBoxVisible && <FilesUploadBox 
            closable={true} onHide={hideFilesBox} style="blocks" reset={resetFiles} onReset={() => setResetFiles(false)} 
            extensions={filesExtensions} 
            onFilesChange={setFiles} autoOpenDialog={_filesUploadBoxProps.autoOpenDialog}
        />}
        {multiline && <div class="btns mt-2">
            {audioRecorder && <ButtonLight onClick={toggleAudioRecorder} iconName="microphone"/>}
            {(attachments && attachments.length > 0) && <ButtonLight onClick={showAttachments} iconName="paperclip"/>}
            <ButtonPrimary onClick={submit} loading={submitting} iconName="paper-plane">{submitBtnText}</ButtonPrimary>
        </div>}
        {(attachments && attachments.length > 0 && attachmentsVisible) && <Attachments minimized={minimized} attachments={attachments} onHide={hideAttachments} onSelectType={onSelectFilesType} />}
    </form>
}