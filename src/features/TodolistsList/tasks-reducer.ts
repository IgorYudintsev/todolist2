import {
    addTodolistAC,
    AddTodolistActionType, FilterValuesType, removeTodolistAC,
    RemoveTodolistActionType, setTodolistsAC,
    SetTodolistsActionType
} from './todolists-reducer'
import {
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistsAPI,
    TodolistType,
    UpdateTaskModelType
} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {AppRootStateType} from '../../app/store'
import {RequestStatusType, setAppStatusAC} from '../../app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TasksStateType = {}

const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        removeTaskAC(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
            let tasks = state[action.payload.todolistId];
            let index = tasks.findIndex(f => f.id === action.payload.taskId)
            if (index > -1) {
                tasks.splice(index, 1)
            }
            // return {
            //     ...state,
            //     [action.payload.todolistId]: state[action.payload.todolistId].filter(t => t.id != action.payload.taskId)
            // }
        },
        addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
            state[action.payload.task.todoListId].unshift(action.payload.task)
            // return {
            //     ...state,
            //     [action.payload.task.todoListId]: [action.payload.task, ...state[action.payload.task.todoListId]]
            // }
        },
        updateTaskAC(state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) {
            let tasks = state[action.payload.todolistId];
            let index = tasks.findIndex(f => f.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
            // return {
            //     ...state,
            //     [action.payload.todolistId]: state[action.payload.todolistId]
            //         .map(t => t.id === action.payload.taskId ? {...t, ...action.payload.model} : t)
            // }

            // const index = state.findIndex(f => f.id === action.payload.id);
            // state[index].title = action.payload.title
        },
        setTasksAC(state, action: PayloadAction<{ tasks: Array<TaskType>, todolistId: string }>) {
            state[action.payload.todolistId] = action.payload.tasks
            // return {...state, [action.payload.todolistId]: action.payload.tasks}
        }
    },
    //сюда вставляем редюсеры от тудулистРедюсера
    extraReducers: (builder) => {
        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todolist.id] = []
        });
        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.id];
        });
        builder.addCase(setTodolistsAC, (state, action) => {
            action.payload.todolists.forEach((tl: any) => {
                state[tl.id] = []
            })
        });
    }
})

// export const tasksReducer = (state: TasksStateType = initialState, action: any): TasksStateType => {
//     switch (action.type) {
//         case 'REMOVE-TASK':
//             return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id != action.taskId)}
//         case 'ADD-TASK':
//             return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
//         case 'UPDATE-TASK':
//             return {
//                 ...state,
//                 [action.todolistId]: state[action.todolistId]
//                     .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
//             }
//         // case 'ADD-TODOLIST': -это временное решение-абы завелось
//             case addTodolistAC.type:
//             return {...state, [action.payload.todolist.id]: []}
//         case removeTodolistAC.type: //-это временное решение-абы завелось
//             const copyState = {...state}
//             delete copyState[action.payload.id]
//             return copyState
//         case setTodolistsAC.type: { //-это временное решение-абы завелось
//             const copyState = {...state}
//             action.payload.todolists.forEach((tl:any) => { //без круглых скобок не подхватит any
//                 copyState[tl.id] = []
//             })
//             return copyState
//         }
//         case 'SET-TASKS':
//             return {...state, [action.todolistId]: action.tasks}
//         default:
//             return state
//     }
// }

export const tasksReducer = slice.reducer

export const removeTaskAC = slice.actions.removeTaskAC
export const addTaskAC = slice.actions.addTaskAC
export const updateTaskAC = slice.actions.updateTaskAC
export const setTasksAC = slice.actions.setTasksAC

// thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsAPI.getTasks(todolistId)
        .then((res) => {
            const tasks = res.data.items
            dispatch(setTasksAC({tasks: tasks, todolistId: todolistId}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
}
export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(res => {
            const action = removeTaskAC({taskId: taskId, todolistId: todolistId})
            dispatch(action)
        })
}
export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                const task = res.data.data.item
                const action = addTaskAC({task: task})
                dispatch(action)
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            //throw new Error("task not found in the state");
            console.warn('task not found in the state')
            return
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...domainModel
        }

        todolistsAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    const action = updateTaskAC({taskId: taskId, model: domainModel, todolistId: todolistId})
                    dispatch(action)
                } else {
                    // @ts-ignore
                    handleServerAppError(res.data, dispatch);
                }
            })
            .catch((error) => {
                // @ts-ignore
                handleServerNetworkError(error, dispatch);
            })
    }

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}
// type ActionsType =
//     | ReturnType<typeof removeTaskAC>
//     | ReturnType<typeof addTaskAC>
//     | ReturnType<typeof updateTaskAC>
//     | AddTodolistActionType
//     | RemoveTodolistActionType
//     | SetTodolistsActionType
//     | ReturnType<typeof setTasksAC>
// type ThunkDispatch = Dispatch<ActionsType>
