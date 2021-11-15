import './category.css';

import {Quest} from '../quest/quest';
import {images} from "../images";
import { Answer } from '../answer/answer';
import {IAnswer} from '../interfaces/interfaces';
import { BaseComponent } from '../baseComponent/baseComponent';

export class Category extends BaseComponent{
    static readonly MAX_COUNT_QUEST:number = 10;
    private quests: Quest[];
    private correctCount: number;
    private startIndex:number;
    private endIndex:number;
    private infoDiv: HTMLDivElement;
    private imgPreView: HTMLDivElement;
    private currentQuest:number;
    private container:HTMLDivElement;

    
    
    constructor(private readonly index:number){
        super('category');
        this.startIndex = this.index * Category.MAX_COUNT_QUEST;
        this.endIndex = this.startIndex + Category.MAX_COUNT_QUEST ;
        this.quests = [];
        this.correctCount = 0;
        this.currentQuest = 0;

    }

    init(container:HTMLDivElement):void{
        this.container = container;
        this.infoDiv = document.createElement('div');
        this.infoDiv.innerHTML = (this.index+1).toString();
        this.imgPreView = document.createElement('div');
        this.imgPreView.className = 'preview';
        this.imgPreView.style.cssText = `background-image:url(./assets/pictures/img/${this.index*Category.MAX_COUNT_QUEST}.jpg)`
        this.toFormQuestion();
        this.node.append(this.infoDiv, this.imgPreView);
    }

    toFormQuestion():void{
        let tmpArr = images.slice(this.startIndex,this.endIndex);
        tmpArr.forEach((item) => {
            let answers:IAnswer[] = [];
            let questImages = document.createElement('div');
            questImages.className = 'quest_img';
            questImages.style.cssText = `background-image:url(./assets/pictures/img/${item.imageNum}.jpg)`;
            answers.push({right:true, answer:item})
            this.addIncorrectAnswers(answers);
            answers = this.shuffle(answers);
            const quest = new Quest();
            quest.init(questImages,answers);
            quest.btnNext.addEventListener('click', ()=>{
                this.nextQuest()
            })
            this.quests.push(quest);
        })
        this.addEventToAnswer();
    }

    addIncorrectAnswers(answers:IAnswer[]):void{
        let incorrectIndex = this.getRandomNum(0,9);
        for (let i = 0; i < 3; i++){
            while (answers.find((item)=> item.answer === images[incorrectIndex]) ){
                incorrectIndex = this.getRandomNum(0,images.length-1);
            }
            answers.push({right:false,answer:images[incorrectIndex]});
        }
        
    }

    addEventToAnswer():void{
        this.quests.forEach((quest)=>{
            quest.getAnswers().forEach((answer)=>{
                answer.node.addEventListener('click',()=>{
                    this.answerHandler(quest, answer);
                })
            })
        })
    }

    shuffle(array:Array<any>):Array<any> {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array
    }

    getRandomNum = (min:number, max:number):number => {
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }

    answerHandler(quest:Quest,answer:Answer){
        if (!quest.getAnswered()){
            if (answer.getRight()){
                this.correctCount++;
                answer.node.classList.add('correct');
            } else {
                answer.node.classList.add('incorrect');
            }
            quest.answered();
        }        
    }

    getQuests():Array<Quest>{
        return this.quests
    }

    showQuest():void{
        this.container.innerHTML = '';
        this.container.append(this.quests[this.currentQuest].node);
    }

    nextQuest(){
        this.currentQuest++;
        if (this.currentQuest === this.quests.length) {
            return;
        }
        this.showQuest();
    }

}