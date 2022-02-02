import axios from 'axios'
import { config } from '../config'

const baseURL = config.HOST_BACKEND_FACE ;
const instance = axios.create({
    baseURL: baseURL
});

export default {
    
    face: (props) => {
        const data = {image: props}
        return (
            instance({
            'method': 'POST',
            'url':`/search`, 
            'headers': {
                'Content-Type' : 'application/json',
                },
            data: data
            })
        )
    },
    
    createFace: (props) => {
        console.log(`props`, props)
        return (
            instance({
            'method': 'POST',
            'url':`/create/person`, 
            'headers': {
                'Content-Type' : 'application/json',
                },
            data: props
            })
        )
    },

    createImage: (props) => {
        return (
            instance({
            'method': 'POST',
            'url':`/create/image`, 
            'headers': {
                'Content-Type' : 'application/json',
                },
            data: props
            })
        )
    }
}