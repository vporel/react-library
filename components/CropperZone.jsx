import Cropper from "cropperjs"
import React, {useState, useRef, useEffect, useCallback, useMemo} from "react"
import { ButtonLight, ButtonPrimary } from "./Button"

/**
 * 
 * @param onValidate blob => void
 * @returns 
 */
export default function cropperZone({title, src, onValidate, loading, onCancel, options = {}}){
    const cropperOptions = useMemo(() => {
        return {viewMode: 1, aspectRatio: 1, ...options}
    }, [options])
    const [cropper, setCropper] = useState(null)
    const imageRef = useRef(null)

    useEffect(() => {
        if(imageRef.current) setCropper(new Cropper(imageRef.current, cropperOptions))
    }, [])

    useEffect(() => {
        if(cropper){
            cropper.replace(src)
        }
    }, [cropper, src])

    const validate = useCallback(() => {
        cropper.getCroppedCanvas().toBlob(blob => {
            onValidate(blob)
        })
    }, [cropper, onValidate])

    return <div id="cropper-zone" class="overlay" style={{zIndex:20}}>
        <div class="overlay__container">
            <div class="overlay__content -w-90 -w-md-60 -h-75 -h-md-70">
                <div class="header d-flex justify-content-between align-items-center flex-column flex-md-row">
                    <h3 class="p-1">{title}</h3>
                    <div class="btns text-end pe-0 pe-md-2">
                        <ButtonPrimary iconName="save" loading={loading} onClick={validate}>Valider</ButtonPrimary>
                        <ButtonLight iconName="times" onClick={onCancel}>Annuler</ButtonLight>
                    </div>
                </div>
                <div class="-h-90">
                    <img src="/favicons/favicon.png" alt="" style={{display: "block", maxWidth: "100%"}} ref={imageRef}/>
                </div>
            </div>
        </div>
    </div>
}