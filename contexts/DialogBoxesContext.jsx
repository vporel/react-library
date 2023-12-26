import React, { useCallback, useRef, useState, createContext} from "react";
import { Modal } from "react-bootstrap";
import _ from "../translator";
import { ButtonLight, ButtonPrimary } from "../components/Button";
import { TextField } from "@mui/material";

const DialogBoxesContext = createContext({})

export function DialogBoxesContextProvider({children}){
    const [alertConfirmType, setAlertConfirmType] = useState("alert")
    const [alertConfirmTitle, setAlertConfirmTitle] = useState("")
    const [alertConfirmMsg, setAlertConfirmMsg] = useState("")
    const [alertConfirmVisible, setAlertConfirmVisible] = useState(false)
    const [alertConfirmAction1, setAlertConfirmAction1] = useState(null)
    const [alertConfirmAction2, setAlertConfirmAction2] = useState(null)

    const alertConfirmDialog = useCallback((type, title, msg, action1, action2) => {//type = alert | confirm
        setAlertConfirmType(type)
        setAlertConfirmTitle(title)
        setAlertConfirmMsg(msg)
        setAlertConfirmAction1(() => () => {
            if(action1) action1()
            setAlertConfirmVisible(false)
        })
        setAlertConfirmAction2(() => () => {
            if(type == "confirm" && action2) action2()
            setAlertConfirmVisible(false)
        })
        setAlertConfirmVisible(true)
    }, [])
    
    const [inputType, setInputType] = useState("alert")
    const [inputTitle, setInputTitle] = useState("")
    const [inputMsg, setInputMsg] = useState("")
    const [inputValue, setInputValue] = useState("")
    const [inputVisible, setInputVisible] = useState(false)
    const [inputAction1, setInputAction1] = useState(null)
    const [inputAction2, setInputAction2] = useState(null)
    const [inputOptions, setInputOptions] = useState({}) // {defaultValue, label, okButtonText, okButtonIcon, cancelButtonText}
    const [inputAction1Loading, setInputAction1Loading] = useState(false)

    const inputDialog = useCallback((type, title, msg, action1, action2, options) => {//type = text | number | textarea
        //Init
        setInputValue("")
        setInputOptions({})

        setInputType(type)
        setInputTitle(title)
        setInputMsg(msg)
        setInputAction1(() => async value => {
            setInputAction1Loading(true)
            if(await action1(value)) setInputVisible(false)
            setInputAction1Loading(false)
        })
        setInputAction2(() => () => {
            if(action2) action2()
            setInputVisible(false)
        })
        if(options){
            setInputOptions(options)
            if(options.defaultValue) setInputValue(options.defaultValue)
        }
        setInputVisible(true)
    }, [])

    return <DialogBoxesContext.Provider value={{
        alertDialog: (title, msg, onOk) => alertConfirmDialog("alert", title, msg, onOk),
        confirmDialog: (title, msg, onYes, onNo) => alertConfirmDialog("confirm", title, msg, onYes, onNo),

        promptText: (title, msg, onOk, onCancel, options = {}) => inputDialog("text", title, msg, onOk, onCancel, options),
        promptNumber: (title, msg, onOk, onCancel, options = {}) => inputDialog("number", title, msg, onOk, onCancel, options),
        promptTextarea: (title, msg, onOk, onCancel, options = {}) => inputDialog("textarea", title, msg, onOk, onCancel, options),
    }}>
        <Modal show={alertConfirmVisible} onHide={alertConfirmAction2} centered contentClassName="border-0">
            <Modal.Header closeButton className="border-0">
                <Modal.Title className="mb-0">{alertConfirmTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{alertConfirmMsg}</p>
            </Modal.Body>
            <Modal.Footer className="border-0">
                <ButtonPrimary onClick={alertConfirmAction1}>{alertConfirmType == "alert" ? "OK" : _("Yes")}</ButtonPrimary>
                {alertConfirmType == "confirm" && <ButtonLight onClick={alertConfirmAction2}>{_("No")}</ButtonLight>}     
            </Modal.Footer>
        </Modal>

        <Modal show={inputVisible} onHide={inputAction2} centered contentClassName="border-0">
            <Modal.Header closeButton className="border-0">
                <Modal.Title className="mb-0">{inputTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="pb-0">
                {(inputMsg != null && inputMsg != "") && <p>{inputMsg}</p>}
                <TextField fullWidth label={inputOptions.label} value={inputValue} onChange={e => setInputValue(e.target.value)} type={inputType == "number" ? "number" : "text"} multiline={inputType == "textarea"}  minRows={4} maxRows={6}/>
            </Modal.Body>
            <Modal.Footer className="border-0">
                <ButtonPrimary onClick={() => inputAction1(inputValue)} loading={inputAction1Loading} iconName={inputOptions.okButtonIcon}>{inputOptions.okButtonText ? inputOptions.okButtonText : "OK"}</ButtonPrimary>
                <ButtonLight onClick={inputAction2}>{inputOptions.cancelButtonText ? inputOptions.cancelButtonText : _("Cancel")}</ButtonLight> 
            </Modal.Footer>
        </Modal>

        {children}
    </DialogBoxesContext.Provider>
}

export default DialogBoxesContext;