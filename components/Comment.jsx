import Avatar from "./Avatar"
import { format } from 'date-fns'
import { parseDate } from '../date'
import LinkTag from './LinkTag'
import React from "react"

/**
 * A comment sent by an user
 */
export default function Comment({comment, authorUrl}){
    return <div className="comment d-flex gap-3">
        <Avatar src={comment.author.avatarUrl} bordered={false}/>
        <div className="w-100">
            <span className="fw-bold"><LinkTag class="color-inherit" href={authorUrl}>{comment.author.firstName }</LinkTag></span>
            <p className="nl2br">{comment.content}</p>
            <span className="position-absolute d-block date" style={{right:0, top:0, fontSize: ".7rem"}}>{format(parseDate(comment.createdAt), "dd/MM/yyyy HH:mm")}</span>
        </div>
    </div>
}