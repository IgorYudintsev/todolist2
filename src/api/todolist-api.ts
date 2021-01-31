import axios from "axios";

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': '0e5dc50f-7e9f-4eda-9157-a63c5026aaad'
    }
}
let todolistIDtoDelete = '9b105ec2-5aa5-4edd-a0ee-31d8e505f6c2';
let todolistIDtoUpdate = 'c831a55a-10f0-4258-87a0-b21b55e7404b';

export const todoApi = {
    getTodos() {
        let promis = axios.get('https://social-network.samuraijs.com/api/1.1/todo-lists', settings);
        return promis
    },
    createTodos() {
        let promis = axios.post('https://social-network.samuraijs.com/api/1.1/todo-lists', {title: 'React'}, settings)
        return promis
    },
    DeleteTodos() {
        let promis = axios.delete(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistIDtoDelete}`, settings)
        return promis
    },
    UpdateTodos() {
        let promis = axios.put(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistIDtoUpdate}`, {title: 'Redux'}, settings)
        return promis
    }
}

