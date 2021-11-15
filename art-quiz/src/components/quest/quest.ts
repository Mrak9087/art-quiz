import "./quest.css";
import { Answer } from "../answer/answer";
import { BaseComponent } from "../baseComponent/baseComponent";
import {IAnswer} from '../interfaces/interfaces';

export class Quest extends BaseComponent{
    private answers: Answer[] = [];
    private question: string = 'Кто автор картины?';//Question;
    private divTxt: HTMLElement;
    private questImages: HTMLElement;
    private questAnswer: HTMLElement;
    private isAnswered:boolean = false;
    private rightAnswer:IAnswer;

    public overlay:HTMLDivElement;
    public btnNext:HTMLElement;
    constructor(){
        super('quest');
        // this.question = 'quest1';
    }

    init(questImages:HTMLDivElement, arrAnswerObj:IAnswer[]):void{
        this.overlay = document.createElement('div');
        this.overlay.className = 'answer_overlay';
        this.divTxt = document.createElement('div');
        this.divTxt.className = 'question'
        this.divTxt.innerHTML = this.question;
        this.btnNext = document.createElement('div');
        this.btnNext.className = 'btn_next';
        this.btnNext.innerText = 'Next';
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
            if (item.right) this.rightAnswer = item;
        })
        this.node.append(this.divTxt,this.questImages,this.questAnswer);
    }

    answered():void{
        this.isAnswered = true;
        this.showRightAnswer();
    }

    getAnswered():boolean{
        return this.isAnswered;
    }

    getAnswers():Array<Answer>{
        return this.answers;
    }

    setQuestion(question:string):void{
        this.question = question;
    }

    showRightAnswer(){
        let ovrContainer = document.createElement('div');
        ovrContainer.className = 'ovr_container';
        
        let miniImg = document.createElement('div');
        miniImg.className = 'mini_img';
        miniImg.style.cssText = `background-image:url(./assets/pictures/img/${this.rightAnswer.answer.imageNum}.jpg)`;
        let picInfo = document.createElement('div');
        picInfo.className = 'picture_info';
        picInfo.innerHTML = `
            <span>${this.rightAnswer.answer.author}</span>
            <span>${this.rightAnswer.answer.name}</span>
            <span>${this.rightAnswer.answer.year}</span>
            `;
        ovrContainer.append(miniImg, picInfo,this.btnNext);

        // this.overlay;
        this.overlay.append(ovrContainer);
        this.node.append(this.overlay);
    }

}