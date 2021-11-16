export interface IAnswer{
    right:boolean, 
    answer:IAnswerContent
}

export interface IAnswerContent{
    author: string,
    name: string,
    year: string,
    imageNum: string
}