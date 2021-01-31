import axios from "axios";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '0e5dc50f-7e9f-4eda-9157-a63c5026aaad'
    }
})


// const settings = {
//     withCredentials: true,
//     headers: {
//         'API-KEY': '0e5dc50f-7e9f-4eda-9157-a63c5026aaad'
//     }
// }
let todolistIDtoDelete = '9b105ec2-5aa5-4edd-a0ee-31d8e505f6c2';
let todolistIDtoUpdate = 'c831a55a-10f0-4258-87a0-b21b55e7404b';

export const todoApi = {
    getTodos() {
        return instance.get('todo-lists');
    },
    createTodos() {
        return instance.post('todo-lists', {title: 'React'})
    },
    DeleteTodos() {
        return instance.delete(`todo-lists/${todolistIDtoDelete}`)
    },
    UpdateTodos() {
        return instance.put(`todo-lists/${todolistIDtoUpdate}`, {title: 'Redux'})
    }
}

