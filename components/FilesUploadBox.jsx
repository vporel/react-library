/**
 * Custom file upload box handling drag an drop
 * Make sure to include the corresponding SCSS file in your page style file
 * @author Vivian NKOUANANG (https://github.com/vporel) <dev.vporel@gmail.com>
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import $ from 'jquery'
import FileUploader from "../classes/FileUploader";
import "cropperjs/dist/cropper.min.css"
import Cropper from 'cropperjs'
import { onMobile } from "../standard";


function $transferZone(fileName){
    return $('\
        <div class="__file-transfer" title="'+fileName+'" data-file-name="'+fileName+'" data-initial-file="false"> \
            <div class="__file-transfer__container"> \
                <div class="thumbnail"></div>\
                <div class="__file-transfer__infos"> \
                    <span class="__file-transfer__file-name">'+fileName+'</span> \
                    <span class="__file-transfer__progress-percentage-wrapper"><span class="__file-transfer__progress-percentage">0</span>%</span> \
                </div> \
                <div class="__file-transfer__progress"><div class="__file-transfer__progress__bar"></div></span></div> \
            </div>\
            <span class="btn-remove"><i class="fas fa-times"></i></span>\
        </div>\
    ')
}

function $initialFile(path, file){
    let $element = $('\
        <div class="__file-transfer" title="'+file+'" data-file-name="'+file+'"data-initial-file="true"> \
            <div class="__file-transfer__container"> \
                <div class="thumbnail"></div>\
                <div class="__file-transfer__progress"><div class="__file-transfer__progress__bar"></div></span></div> \
            </div>\
            <span class="btn-remove"><i class="fas fa-times"></i></span>\
        </div>\
    ')
    addThumbnail($element, file, path+"/"+file)
    return $element
}

function addThumbnail($transferZone, fileName, fileSrc){
    fileName = fileName.toLowerCase()
    $transferZone.addClass("uploaded")
    let thumbnail = '<i class="icon fas fa-file-'+ (fileName.endsWith(".pdf") ? "pdf" : "word") + '"></i>';
    
    if(fileName.endsWith(".jpeg") || fileName.endsWith(".jpg") || fileName.endsWith(".png") || fileName.endsWith(".gif")){ // Image
        thumbnail = '<img src="'+fileSrc+'" class="image"/>'
    }
    $transferZone.find('.thumbnail').html(thumbnail)
}

/**
 * Options examples
 * {
        aspectRatio: 1,
        viewMode: 1,
    }
 */

/**
 * @component
 * @param {*} param0 (style: lines | blocks)
 * @param {function} onRemoveInitialFile Param: fileName
 * 
 * @returns 
 */
export function FilesUploadBox({
    maxSize,   //Max files size in octets
    onHide, extensions, onLoadingFilesChange, onFilesChange, onRemoveInitialFile, onError, style="lines",
    initialFiles, initialFilesPath, imagesCropperOptions, reset = false, onReset,
    compressImages = false, //Says if the images should be compressed when the size if greater than the maxSize
    autoOpenDialog,
    closable = false,
}){
    const filesZone = useRef(null)
    const [cropper, setCropper] = useState(null)
    const [cropperVisible, setCropperVisible] = useState(false)
    const [cropping, setCropping] = useState(false)
    const [currentCropFile, setCurrentCropFile] = useState(null)
    const [cropQueue, setCropQueue] = useState([]) // Array : {file, src}
    const cropperImage = useRef(null)
    const [files, setFiles] = useState([])
    const [loadingFiles, setLoadingFiles] = useState([])
    const addFile = useCallback((fileName, file) => {
        setFiles(files => {
            let newFiles = [...files, {fileName, file}]
            if(typeof onFilesChange == "function") onFilesChange(newFiles.map(f => f.file))
            return newFiles
        })
    }, [setFiles, onFilesChange])

    const removeFile = useCallback((fileName) => {
        setFiles(files => {
            let newFiles = files.filter(f => f.fileName != fileName)
            if(typeof onFilesChange == "function") onFilesChange(newFiles.map(f => f.file))
            return newFiles
        })
    }, [setFiles, onFilesChange])

    const endCropping = useCallback(() => {
        setCropQueue(q => {
            q.pop()
            if(q.length == 0)
                setCropperVisible(false)
            return q
        })
        setCropping(false)
    }, [setCropQueue, setCropperVisible, setCropping])

    useEffect(() => {
        if(imagesCropperOptions){
            setCropper(new Cropper(cropperImage.current, imagesCropperOptions))
        }
    }, [])

    useEffect(() => { // Next crop
        if(imagesCropperOptions){
            if(cropQueue.length > 0 && !cropping){
                const element = cropQueue[cropQueue.length-1]
                setCurrentCropFile(element.file)
                cropper.replace(element.src)
                setCropperVisible(true)
                setCropping(true)
            }
        }
    }, [imagesCropperOptions, cropper, cropQueue, cropping, setCurrentCropFile, setCropping])

    const validateCrop = useCallback(() => {
        cropper.getCroppedCanvas().toBlob(blob => {
            addFile(currentCropFile.name, blob)
        })
        endCropping()
    }, [cropper, endCropping, currentCropFile, addFile])

    const cancelCrop = useCallback(() => {
        $(filesZone.current).find('.__file-transfer[data-file-name="'+currentCropFile.name+'"] .btn-remove').trigger('click')
        endCropping()
    }, [filesZone, endCropping, currentCropFile])

    useEffect(() => {
        if(initialFiles){
            for(let file of initialFiles){
                let $element = $initialFile(initialFilesPath, file)
                $(filesZone.current).prepend($element)
            }
        }
    }, [filesZone, initialFilesPath, initialFiles])
    useEffect(() => {
        const fileUploader = new FileUploader({
            maxSize, extensions, compressImages,
            onStart: file => {
                setLoadingFiles(list => [...list, file])
                if(onLoadingFilesChange) onLoadingFilesChange()
                $(filesZone.current).prepend($transferZone(file.name))
            },
            onUploaded: (file, src) => {
                const fileNameLower = file.name.toLowerCase()
                const $transferZone = $(filesZone.current).find('.__file-transfer[data-file-name="'+file.name+'"]')
                addThumbnail($transferZone, fileNameLower, src)
                if(imagesCropperOptions && (fileNameLower.endsWith(".png") || fileNameLower.endsWith(".jpg") || fileNameLower.endsWith(".jpeg")))
                    setCropQueue(q => [{file, src}, ...q])
                else
                    addFile(file.name, file)
                setLoadingFiles(list => list.filter(f => f != file))
                if(onLoadingFilesChange) onLoadingFilesChange()
            },
            onError: (file, error) => {
                if(typeof onError == "function") onError(error, file.name, file)
            },
            onProgress: (file, percentage) => {
                const $transferZone = $(filesZone.current).find('.__file-transfer[data-file-name="'+file.name+'"]')
                let $progressBar = $transferZone.find(".__file-transfer__progress__bar");
                let $progressPercentage = $transferZone.find(".__file-transfer__progress-percentage");
                $progressPercentage.text(percentage)
                $progressBar.css("width", percentage + "%");
            }
        })
        $(filesZone.current).bind({
            dragover: function(event){
                event.preventDefault()
                $(this).parent().addClass("drag-active")
            },
            dragleave: function(event){
                event.preventDefault()
                $(this).parent().removeClass("drag-active")
            },
            drop: function(event){
                event.stopPropagation()
                event.preventDefault()
                $(this).parent().removeClass("drag-active")
                for(let file of event.originalEvent.dataTransfer.files){
                    fileUploader.upload(file)
                }
                
            }
        })
        
        $(filesZone.current).find(".placeholder-box").bind({
            click: event => {
                event.stopPropagation()
                event.preventDefault()
                $(filesZone.current).find("input").trigger("click")
            }
        })

        $(filesZone.current).find("input").bind({
            change: function(event){
                event.preventDefault()
                for(let file of $(this)[0].files){
                    fileUploader.upload(file)
                }
                $(this).val(null)
            }
        })

        return () => {
            $(filesZone.current).unbind("dragover")
            $(filesZone.current).unbind("dragleave")
            $(filesZone.current).unbind("drop")
            $(filesZone.current).find(".placeholder-box").unbind("click")
            $(filesZone.current).find("input").unbind("change")
        }

        
    }, [filesZone, addFile, onError, extensions, maxSize, imagesCropperOptions, onHide, onLoadingFilesChange])

    useEffect(() => {
        if(autoOpenDialog)
            $(filesZone.current).find(".placeholder-box").trigger('click')
    }, [])

    //Handle reset
    useEffect(() => {
        //When the value of reset changes (it can be done by the parent component)
        if(reset){
            $(filesZone.current).find(".__file-transfer").remove()
            setLoadingFiles([])
            setFiles([])
            if(onReset) onReset()
        }
    }, [reset, onReset])

    useEffect(() => { // Remove files
        $(filesZone.current).on('click', '.__file-transfer .btn-remove', function(){
            const initialFile = $(this).parent().attr("data-initial-file")
            const fileName = $(this).parent().attr("data-file-name")
            if(initialFile == "true")
                onRemoveInitialFile(fileName)
            else
                removeFile(fileName)
            $(this).parent().remove()
        })
        return () => $(filesZone.current).off('click')
    }, [filesZone, removeFile, onRemoveInitialFile])

    return <div className="files-upload-box">
        {(closable && loadingFiles.length == 0 && files.length == 0) && <i className="fas fa-times fs-4 hover:color-primary" onClick={onHide} style={{zIndex: 2, position: "absolute", right: 5, top: 5}}/>}
        {imagesCropperOptions 
        ? <div id="cropper-zone" class="overlay" style={{zIndex:20}} hidden={!cropperVisible}>
            <div class="overlay__container position-relative">
                <div class="overlay__content -w-90 -w-md-90 -h-75 -h-md-90">
                    <div style={{zIndex:10, bottom:0, right:0}} class="header position-absolute d-flex justify-content-end text-end p-2 gap-2">
                        <button class="btn btn-primary" onClick={validateCrop}>Valider</button>
                        <button class="btn btn-light" onClick={cancelCrop}>Annuler</button>
                    </div>
                    <div class="h-100">
                        <img ref={cropperImage} src="" alt=""  style={{display: "block", maxWidth: "100%"}}/>
                    </div>
                </div>
            </div>
        </div> : ""}
        <div className={"files "+style} ref={filesZone}>
            <div class="placeholder-box">{onMobile() ? "Cliquez ici" : "Cliquez ici ou déposez des fichiers"}</div>
            <input type="file" multiple hidden accept={extensions.length > 0 ? extensions.join(", ") : "*"}/>
        </div>
    </div>
}