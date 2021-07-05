import moment from 'moment'
import { IFirebaseTimeStampe } from '../types.any'

export const getParameterByName = (name: string, url: string) => {
    const param_name = name.replace(/[[\]]/g, '\\$&')
    const regex = new RegExp(`[?&]${param_name}(=([^&#]*)|&|#|$)`)
    const results = regex.exec(url)
    if (!results) {
        return null
    }
    if (!results[2]) {
        return ''
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

/**
 * returns the moment object associated to a firestore timestamp
 *
 * @note from firestore, a new Date() in the backend generates a timestamp, which, when read into the front end
 * seems to just be an object with fields _seconds, and _nanoseconds i.e. const date = {_seconds: 123123123, _nanoseconds: 312342}
 * odly, simply doing moment(date) does not work...
 */
export const timestampToMoment = (timestamp: IFirebaseTimeStampe) => {
    return moment.unix(timestamp._seconds).utc() // returns a moment
}
