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

export interface ISetting{
    soundActive: boolean,
    soundLevel: number,
    timeActive: boolean,
    timeValue:number,
}

export interface IStorageCategory{
    correctCount:number,
    score:any[],
}
