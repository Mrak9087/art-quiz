import "./quest.css";
import { Answer } from "../answer/answer";
import { BaseComponent } from "../baseComponent/baseComponent";

export class Quest extends BaseComponent{
    private answers: Answer[] = [];
    private question: string = 'Кто автор картины?';//Question;
    private divTxt: HTMLElement;
    private questImages: HTMLElement;
    private questAnswer: HTMLElement;
    private isAnswered:boolean = false;
    constructor(){
        super('quest');
        // this.question = 'quest1';
    }

    init(questImages:HTMLDivElement, arrAnswerObj:{right:boolean, answer:{author: string,name: string,year: string,imageNum: string}}[]):void{
        this.divTxt = document.createElement('div');
        this.divTxt.className = 'question'
        this.divTxt.innerHTML = this.question;
        this.questImages = document.createElement('div');
        this.questImages.className = 'quest_images';
        // questImages.className = 'quest_img'
        this.questImages.append(questImages);
        this.questAnswer = document.createElement('div');
        this.questAnswer.className = 'answer_container';
        arrAnswerObj.forEach((item) => {
            const answerObj = new Answer(item.answer.author,item.right);
            this.answers.push(answerObj);
            this.questAnswer.append(answerObj.node);
        })
        this.node.append(this.divTxt,this.questImages,this.questAnswer);
    }

    answered():void{
        this.isAnswered = true;
    }

    getAnswered():boolean{
        return this.isAnswered;
    }

    getAnswers():Array<Answer>{
        return this.answers;
    }
}