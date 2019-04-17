import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const getIcon = (props) => {
    if(props.sortable)
    {
        if(props.order === 1){
            return(<FontAwesomeIcon icon="sort-up"></FontAwesomeIcon>)
        }
        if(props.order === 2){
            return(<FontAwesomeIcon icon="sort-down"></FontAwesomeIcon>)
        }
        return(<FontAwesomeIcon icon="sort"></FontAwesomeIcon> )
    }
    else
    {
        return(<span></span>)
    }
}

const sortIcon = (props) => (<span className='float-right'>{getIcon(props)}</span>)
export default sortIcon;