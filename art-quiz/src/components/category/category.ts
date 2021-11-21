import './category.css';

import {Quest} from '../quest/quest';
import {images} from "../images";
import { Answer } from '../answer/answer';
import {IAnswer} from '../interfaces/interfaces';
import {ISetting, IStorageCategory} from '../interfaces/interfaces';
import { BaseComponent } from '../baseComponent/baseComponent';
import { View } from '../view/view';
import {AnswerType} from "../enums/enums"
import ok from '../../assets/sounds/correctanswer.mp3';
import wrong from '../../assets/sounds/wronganswer.mp3';

export class Category extends BaseComponent{
    static readonly MAX_COUNT_QUEST:number = 10;
    private quests: Quest[];
    private correctCount: number;
    private startIndex:number;
    private endIndex:number;
    private headPreView:HTMLDivElement;
    private scopeView:HTMLDivElement;
    private infoDiv: HTMLDivElement;
    private imgPreView: HTMLDivElement;
    private currentQuest:number;
    private container:HTMLDivElement;
    private view: View;
    private answerType: AnswerType;
    private setting:ISetting;
    private okAnswer:HTMLAudioElement;
    private wrongAnswer:HTMLAudioElement;
    private second:number = 30;
    private questTxt:HTMLDivElement;
    private questTime:HTMLDivElement;
    private headCategory:HTMLDivElement;
    private wrapper:HTMLDivElement;
    private idTimer:NodeJS.Timeout;//NodeJS.Timeout

    private categorysStorage:IStorageCategory[];
    
    constructor(private readonly index:number){
        super('category');
        this.startIndex = this.index * Category.MAX_COUNT_QUEST;
        this.endIndex = this.startIndex + Category.MAX_COUNT_QUEST ;
        this.quests = [];
        this.correctCount = 0;
        this.currentQuest = 0;

    }

    init(container:HTMLDivElement, view:View, setting:ISetting,answerType: AnswerType = AnswerType.text):void{
        if (answerType === AnswerType.text){
            this.categorysStorage = JSON.parse(localStorage.getItem('artArtistCategorys')) || [];
        } else {
            this.categorysStorage = JSON.parse(localStorage.getItem('artPictureCategorys')) || [];
        }

        if (this.categorysStorage[this.index]){
            this.correctCount = this.categorysStorage[this.index].correctCount || 0;
        } else {
            this.correctCount = 0;
        }
        
        
        this.container = container;
        this.view = view;
        this.setting = setting;
        this.okAnswer = new Audio(ok);
        this.okAnswer.volume = setting.soundLevel;
        this.wrongAnswer = new Audio(wrong);
        this.wrongAnswer.volume = setting.soundLevel;
        this.answerType = answerType;
        this.infoDiv = document.createElement('div');
        this.infoDiv.className = 'cat_name';
        this.infoDiv.innerHTML = `Категория ${this.index+1}`;
        this.scopeView = document.createElement('div');
        this.scopeView.innerHTML = `${this.correctCount}/${Category.MAX_COUNT_QUEST}`
        this.headPreView = document.createElement('div');
        this.headPreView.className = 'head_preview';
        this.headPreView.append(this.infoDiv, this.scopeView);
        this.imgPreView = document.createElement('div');
        this.imgPreView.className = 'preview';
        this.imgPreView.style.cssText = `background-image:url(./assets/pictures/img/${this.index*Category.MAX_COUNT_QUEST}.jpg)`
        
        this.toFormQuestion();
        
        this.headCategory = document.createElement('div');
        this.headCategory.className = 'head_category';
        this.questTxt = document.createElement('div');
        this.questTxt.className = 'quest_txt';
        this.questTime = document.createElement('div');
        this.questTime.className = 'quest_time';
        this.headCategory.append(this.questTxt, this.questTime);
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'category_wrapper';
        this.wrapper.append(this.headCategory);

        this.node.append(this.headPreView, this.imgPreView);
    }

    toFormQuestion():void{
        let tmpArr = images.slice(this.startIndex,this.endIndex);
        tmpArr.forEach((item) => {
            let answers:IAnswer[] = [];
            
            answers.push({right:true, answer:item})
            this.addIncorrectAnswers(answers);
            answers = this.shuffle(answers);
            const quest = new Quest(this.answerType);
            if (this.answerType ===  AnswerType.text){
                let questImages = document.createElement('div');
                questImages.className = 'quest_img';
                questImages.style.cssText = `background-image:url(./assets/pictures/img/${item.imageNum}.jpg)`;
                quest.init(questImages,answers);
            } else {
                quest.init(null,answers);
            }
            
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
            while (answers.find((item)=> item.answer.author === images[incorrectIndex].author) ){
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
                if (this.setting.soundActive){
                    this.okAnswer.play();
                }
                
                this.correctCount++;
                answer.node.classList.add('correct');
                quest.answered(true);
            } else {
                if (this.setting.soundActive){
                    this.wrongAnswer.play();
                }

                answer.node.classList.add('incorrect');
                quest.answered(false);
            }
        }    
        clearTimeout(this.idTimer);    
    }

    getQuests():Array<Quest>{
        return this.quests
    }

    showQuest():void{
        this.container.innerHTML = '';
        this.wrapper.innerHTML = '';
        let quest = this.quests[this.currentQuest];
        this.questTxt.innerHTML = quest.getQuestion(); 
        this.wrapper.append(this.headCategory, quest.node)
        this.container.append(this.wrapper);
        if (this.setting.timeActive){
            this.second = this.setting.timeValue;
            this.idTimer = setTimeout(()=>{this.setSecond(quest)},0);
        }
        
    }

    async nextQuest(){
        this.currentQuest++;
        if (this.currentQuest === this.quests.length) {
            this.saveToLocalStorage();
            this.currentQuest = 0;
            this.container.innerHTML = '';
            await this.view.showMenu();
            this.clearQuests();
            return;
        }
        // this.showQuest();
        await this.view.categoryHandler(this);
    }

    clearQuests(){
        this.quests.splice(0,this.quests.length);
        this.correctCount = 0;
        this.toFormQuestion();
    }

    setSecond(quest:Quest){
        this.second--;
        this.questTime.innerHTML = this.addZero(this.second);
        if (!this.second){
            if (this.setting.soundActive){
                this.wrongAnswer.play();
            }
            quest.answered(false);
            clearTimeout(this.idTimer);
            
        } else {
            this.idTimer = setTimeout(()=>{this.setSecond(quest)},1000);
        }
        
    }

    addZero(n:number):string{
        return (n < 10 ? '0' : '') + n; 
    }

    saveToLocalStorage():void{
        let objTmp = {
            correctCount:this.correctCount,
            score:this.quests.splice(0),
        }
        this.categorysStorage[this.index] = objTmp;
        if (this.answerType === AnswerType.text){
            localStorage.setItem('artArtistCategorys',JSON.stringify(this.categorysStorage));
        } else {
            localStorage.setItem('artPictureCategorys',JSON.stringify(this.categorysStorage));
        }
        
    }

}