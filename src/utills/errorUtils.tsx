import {setAppErrorAC, setAppErrorACType, setAppStatusACType} from "../app/App-reducer";
import {Dispatch} from "redux";
import {ResponseType} from '../api/todolists-api'

export const handleServerNetworkError=(message:string,dispatch:Dispatch<ErrorUtilsActionType>)=>{
    dispatch(setAppErrorAC(message));
    dispatch(setAppErrorAC("failed"))
}

export const handleServerAppError=(data:any,dispatch:Dispatch<ErrorUtilsActionType>)=>{
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC("ERROR"))
    }
    dispatch(setAppErrorAC("failed"))
}

type ErrorUtilsActionType= setAppStatusACType | setAppErrorACType