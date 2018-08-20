import React from 'react'

export default props => (
    <input {...props.input} placeholder={props.placeholder} type={props.type} readOnly={props.readOnly} />
)