import { range } from "../array";
import React from "react"

/**
 * 
 * @param {*} param0 - onChangePage: (page) => void
 * @returns 
 * @author Vivian NKOUANANG (https://github.com/vporel) <dev.vporel@gmail.com>
 */
export default function Pagination({page, pagesCount, onChangePage}){
    const min = (page - 5) > 1 ? page - 5 : 2
    const max = (pagesCount == 2) ? null : ((page + 5) < pagesCount ? (page + 5) : (pagesCount - 1))

    return pagesCount == 1 ? "" : (
        <div className="pagination">
            <span className="page arrow" hidden={page == 1} onClick={() => onChangePage(page-1)}>&#10094;</span>
            <span className={"page "+(page == 1 ? "active" : "")} onClick={() => onChangePage(1)}>1</span>
            { min > 2 && <span>...</span>}
            { max != null
                ? range(min, max).map(p => <span className={"page "+(page == p ? "active" : "")}  onClick={() => onChangePage(p)}>{p}</span>)
                : ""
            }
            { (max != null && max < (pagesCount - 1)) && <span>...</span>}
            <span className={"page "+(page == pagesCount ? "active" : "")} onClick={() => onChangePage(pagesCount)}>{pagesCount}</span>
            <span className="page arrow" hidden={page == pagesCount} onClick={() => onChangePage(page+1)}>&#10095;</span>
        </div>
    )
}