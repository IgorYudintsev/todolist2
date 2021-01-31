import axios from "axios";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '0e5dc50f-7e9f-4eda-9157-a63c5026aaad'
    }
})


type TodoType={
    id: string,
    title: string,
    addedDate: string,
    order: number
}


type CreateResponseType={
    resultCode: number,
    messages:Array<string>,
    fieldsErrors:Array<string>
    data: {
        item:   TodoType
    }}

    type DeleteResponseType={
        resultCode:number,
        messages: Array<string>,
        data: {
            item:   TodoType
        }
    }

    type updateTodolistResponseType={
        resultCode: 1
        messages: ['Something wrong'],
        data: {}
    }
let todolistIDtoDelete = '9b105ec2-5aa5-4edd-a0ee-31d8e505f6c2';
let todolistIDtoUpdate = 'c831a55a-10f0-4258-87a0-b21b55e7404b';

export const todoApi = {
    getTodos() {
        return instance.get<Array<TodoType>>('todo-lists');
    },
    createTodos<TodoType>() {
        return instance.post<Array<CreateResponseType>>('todo-lists', {title: 'React'})
    },
    DeleteTodos() {
        return instance.delete<Array<DeleteResponseType>>(`todo-lists/${todolistIDtoDelete}`)
    },
    UpdateTodos() {
        return instance.put(`todo-lists/${todolistIDtoUpdate}`, {title: 'Redux'})
    }
}

