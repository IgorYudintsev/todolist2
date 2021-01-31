import axios from "axios";

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': '0e5dc50f-7e9f-4eda-9157-a63c5026aaad'
    }
}

export const todoApi={
    getTodos(){
        let promis=axios.get('https://social-network.samuraijs.com/api/1.1/todo-lists',settings);
        return promis
    }
}