import React from 'react'
import { Image } from 'semantic-ui-react'

const Img = (props) => (
    console.log(`props`, props.img),
    <Image src =  {URL.createObjectURL(props.img)} size = 'small' />
)

export default Img