import axios from "axios";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '0e5dc50f-7e9f-4eda-9157-a63c5026aaad'
    }
})


type TodoType = {
    id: string,
    title: string,
    addedDate: string,
    order: number
}

//
// type CreateResponseType={
//     resultCode: number,
//     messages:Array<string>,
//     fieldsErrors:Array<string>
//     data: {
//         item:   TodoType
//     }}
//
//     type DeleteResponseType={
//         resultCode:number,
//         messages: Array<string>,
//         data: {}
//     }
//
//     type updateTodolistResponseType={
//         resultCode: 1
//         messages: ['Something wrong'],
//         data: {}
//     }
//т.е принимает Т
type CommonResponseType<T> = {
    resultCode: number,
    messages: Array<string>,
    fieldsErrors: Array<string>
    data: T //разная: в одних случаях это data: {}, в других data: {item:   TodoType}
}

let todolistIDtoDelete = '9b105ec2-5aa5-4edd-a0ee-31d8e505f6c2';
let todolistIDtoUpdate = 'c831a55a-10f0-4258-87a0-b21b55e7404b';

export const todoApi = {
    getTodos() {
        return instance.get<TodoType>('todo-lists');
    },
    createTodos<TodoType>() {
        //                                      передаем Т
        return instance.post<CommonResponseType<{ item: TodoType }>>('todo-lists', {title: 'React'})
    },
    DeleteTodos() {
        //                                      передаем Т
        return instance.delete<CommonResponseType<{}>>(`todo-lists/${todolistIDtoDelete}`)
    },
    UpdateTodos() {
        //                                      передаем Т
        return instance.put<CommonResponseType<{}>>(`todo-lists/${todolistIDtoUpdate}`, {title: 'Redux'})
    }
}

