import "./answer.css";
import { BaseComponent } from "../baseComponent/baseComponent";

export class Answer extends BaseComponent{
    private isRight:boolean;
    private answerContent:string;
    constructor(answerContent:string,isRight:boolean){
        super('answer')
        this.isRight = isRight;
        this.answerContent = answerContent;
        this.node.innerHTML = this.answerContent;
    }
    
    getRight():boolean{
        return this.isRight;
    }

    getAnswer():string{
        return this.answerContent;
    }
}