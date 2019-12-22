export interface ResponseModel<T> {
    statuscode : number;
    message : string;
    data : T
}