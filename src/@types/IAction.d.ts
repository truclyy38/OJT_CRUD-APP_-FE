import { IUser } from "./IUser";

export interface IAction {
    type:string,
    payload: IUser,
}