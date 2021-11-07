export class Answer{
    private isRight:boolean;
    private answerContent:string;
    constructor(answerContent:string,isRight:boolean){
        this.isRight = isRight;
        this.answerContent = answerContent;
    }
    
    getRight():boolean{
        return this.isRight;
    }

    getAnswer():string{
        return this.answerContent;
    }
}