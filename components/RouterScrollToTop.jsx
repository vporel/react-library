import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSearchParams } from "../hooks";

let lastPage = null
/**
 * Scroll to top when the route changes
 * This component should be use only one time in a page
 */
export default function RouterScrollToTop(){
    const { pathname } = useLocation()
    const searchParams = useSearchParams()

    useEffect(() => {
      if(searchParams.page) lastPage = searchParams.page
    }, [])
  
    useEffect(() => {
      window.scrollTo({top: 0, left: 0, behavior: "instant"});
    }, [pathname])

    useEffect(() => {
      if(searchParams.page != lastPage){  //Scroll to top only if the page changes
        if(lastPage != null || searchParams.page != 1) window.scrollTo({top: 0, left: 0, behavior: "instant"});
        lastPage = searchParams.page
      }
    }, [searchParams])

}