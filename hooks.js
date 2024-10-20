import React, {useCallback, useEffect, useMemo, useState} from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { getUrlSearchString } from '@vporel/js/url';

/**
 * @param {bool} defaultValue
 * 
 * @return 
 */
export function useToggle(defaultValue = false){
    const [value, setValue] = useState(defaultValue)
    return [value, () => setValue(value => !value)]
}


/**
 * @param {bool} defaultValue
 * 
 * @return 
 */
export function useBooleanState(defaultValue = false){
    const [value, setValue] = useState(defaultValue)
    return [
        value, 
        () => setValue(true),   //set
        () => setValue(false),  //reset
        () => setValue(v => !v) //toggle
    ]
}

/**
 * Custom useSearchPArams hook
 */
export function useSearchParams(){
    let search = window.location.search
    try{ search = useLocation().search } //If a router exists
    catch{  }

    const params = useMemo(() => {
        const prs = {}
        const urlSearchParams = new URLSearchParams(search)
        for(const key of urlSearchParams.keys()) prs[key] = urlSearchParams.get(key)
        return prs
    }, [search])
    return params
}

/**
 * Filter using the url search query
 * @param {array} keys 
 */
export function useSearchFilter(keys){
    const searchParams = useSearchParams()
    const initialValues = {page: searchParams.page ?? 1}
    for(const k of keys) initialValues[k] = searchParams[k] ?? ""
    const [options, setOptions] = useState(initialValues)
    const navigate = useNavigate()
    const filter = useCallback((name, value) => {
        if(options[name] != value){ //Change only for a new value
            setOptions(opts => {
                const newOptions = {...opts, [name]: value, page: 1}
                if(name == "page") newOptions.page = value
                navigate(window.location.pathname+"?"+getUrlSearchString(newOptions))    //Push new state
                return newOptions
            })
        }
    }, [options, setOptions, navigate])

    return [options, filter]
}

/**
 * 
 */
export function useURL(){
    try{ return useLocation().pathname } //If there's a react-router context
    catch{ return window.location.pathname }
}

/**
 * Utilisé pour différentes sections de commentaires (cours, questions, ...); 
 * les sections d'avis égalements (avis sur les enseignants, ...)
 * @component
 * @param {number} parentId Ex :  courseId for comments on a course
 * @param {Component} ElementsComponent Le component à utiliser pour afficher les différents commentaires. Il doit prendre un param_tre nommé 'element'
 * @param {function} loadFunction Fonction de chargement des commentaires depuis le serveur. C'est une fonction ne prenant qu'un seul paramètre, l'id de parent (par exemple, id du cours)
 * @param {function} sendFunction Fonction d'envoi du noiveau commentaire au serveur
 * @param {boolean} visible Détermine la boite des commentaires doit être affichée
 * @param {comment => void} onPostComment Callback appelé après que le commentaires ait été enregistré dans le serveur avec succès
 * @param {comment => jsx} createItem
 * @author Vivian NKOUANANG (https://github.com/vporel) <dev.vporel@gmail.com>
 * 
 */
export function useCommentsState(parentId, loadFunction, sendFunction, options){
    const {visible, onPostComment} = options ? options : {visible: true}
    const [loading, setLoading] = useState(false)
    const [comments, setComments] = useState([])
    const [commentsLoaded, setCommentsLoaded] = useState(false)
    const [otherResults, setOtherResults] = useState(false)

    const loadComments = useCallback(async loadAll => {
        setLoading(true);
        let response = await loadFunction(parentId, comments.length, loadAll ? null : 10)
        setComments(comments => [...comments, ...(response.data ?? [])])
        setOtherResults(response.page != response.pagesCount)
        setLoading(false)
    }, [loadFunction, setLoading, setComments, comments, setOtherResults, parentId])

    //Chargement asynchrone des commentaires lorsque loaded passe à true
    useEffect(() => {
        (async function(){
            if(visible && !commentsLoaded){
                loadComments()
                setCommentsLoaded(true);
            }
        })()
    }, [commentsLoaded, setCommentsLoaded, visible])

    //Send the written comment
    const sendComment = useCallback(async comment => {
        if(comment == "") return;
        if(otherResults) await loadComments(true) // Load all comments
        let postedComment = (await sendFunction(parentId, comment)).data
        if(postedComment){ // Data from the server
            setComments(comments => [...comments, postedComment])
            if(onPostComment != null) onPostComment()
            return true;                        
        }
        return false
    }, [setComments, sendFunction, loadComments, otherResults, onPostComment])

    return {loading, loadComments, comments, otherResults, sendComment}
}

export function usePaginator(getFunction, options){
    const [elements, setElements] = useState(null)
    const [page, setPage] = useState(1)
    const [pagesCount, setPagesCount] = useState(1)
    const [total, setTotal] = useState(0)
    useEffect(() => {
        (async () => {
            setElements(null)
            const response = await getFunction(options)
            if(response.status == 1){
                setElements(response.data)
                setPage(response.page)
                setPagesCount(response.pagesCount)
                setTotal(response.total)
            }
        })()
    }, [getFunction, options, setElements, setPage, setPagesCount, setTotal])
    
    return [elements, page, pagesCount, total]
}
