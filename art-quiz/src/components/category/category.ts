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
import endround from '../../assets/sounds/endround.mp3';

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
    private endRound:HTMLAudioElement;
    private second:number = 30;
    private questTxt:HTMLDivElement;
    private questTime:HTMLDivElement;
    private headCategory:HTMLDivElement;
    private wrapper:HTMLDivElement;
    private scoreWrapper:HTMLDivElement;
    private idTimer:NodeJS.Timeout;//NodeJS.Timeout
    private nameCategory:string;
    private scoreContainer: HTMLDivElement;
    private scoreItems:HTMLDivElement[];
    private scoreBtn:HTMLButtonElement;
    private btnHome:HTMLButtonElement;
    private btnCat:HTMLButtonElement;
    private btnWrap:HTMLDivElement;

    private categorysStorage:IStorageCategory[];
    
    constructor(private readonly index:number){
        super('category');
        this.startIndex = this.index * Category.MAX_COUNT_QUEST;
        this.endIndex = this.startIndex + Category.MAX_COUNT_QUEST ;
        this.quests = [];
        this.scoreItems = [];
        this.correctCount = 0;
        this.currentQuest = 0;
        this.nameCategory = `Категория ${this.index+1}`;
    }

    init(container:HTMLDivElement, view:View, setting:ISetting,answerType: AnswerType = AnswerType.text):void{
        if (answerType === AnswerType.text){
            this.categorysStorage = JSON.parse(localStorage.getItem('artArtistCategorys')) || [];
        } else {
            this.categorysStorage = JSON.parse(localStorage.getItem('artPictureCategorys')) || [];
        }
        this.btnHome = document.createElement('button');
        this.btnHome.className = 'btn_win'
        this.btnHome.innerHTML = 'home';
        this.btnHome.addEventListener('click',()=>{
            this.view.showMenu();
        })

        this.btnCat = document.createElement('button');
        this.btnCat.className = 'btn_win'
        this.btnCat.innerHTML = 'category';
        this.btnCat.addEventListener('click',()=>{
            this.view.showCategories();
        })

        this.btnWrap = document.createElement('div');
        this.btnWrap.className = 'btn_wrap';
        this.btnWrap.append(this.btnHome, this.btnCat);

        this.container = container;
        this.view = view;
        this.setting = setting;
        this.okAnswer = new Audio(ok);
        this.okAnswer.volume = setting.soundLevel;
        this.wrongAnswer = new Audio(wrong);
        this.wrongAnswer.volume = setting.soundLevel;
        this.endRound = new Audio(endround);
        this.endRound.volume = setting.soundLevel;
        this.answerType = answerType;
        this.infoDiv = document.createElement('div');
        this.infoDiv.className = 'cat_name';

        this.scoreBtn = document.createElement('button');
        this.scoreBtn.className = 'score_btn';
        this.scoreBtn.innerHTML = 'score';
        this.scoreBtn.addEventListener('click',(e)=>{
            e.stopPropagation()
            view.showScore(this);
        });
        this.infoDiv.innerHTML = this.nameCategory;
        this.scopeView = document.createElement('div');
        this.scopeView.className = 'score_view';
        
        this.headPreView = document.createElement('div');
        this.headPreView.className = 'head_preview';
        this.headPreView.append(this.infoDiv, this.scopeView);
        this.imgPreView = document.createElement('div');
        this.imgPreView.className = 'preview';
        if (this.answerType === AnswerType.text){
            this.imgPreView.style.backgroundImage = `url(./assets/pictures/img/${this.index*Category.MAX_COUNT_QUEST}.jpg)`
        } else {
            this.imgPreView.style.backgroundImage = `url(./assets/pictures/img/${this.index*Category.MAX_COUNT_QUEST + 120}.jpg)`
        }
        
        if (!this.categorysStorage[this.index]){
            this.imgPreView.style.filter = 'grayscale(100%)';
        }
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

        this.scoreWrapper = document.createElement('div');
        this.scoreWrapper.className = 'score_wrapper'
        this.node.append(this.headPreView, this.imgPreView);

        if (this.categorysStorage[this.index]){
            this.correctCount = this.categorysStorage[this.index].correctCount || 0;
            if (this.categorysStorage[this.index].score.length){
                this.setScoreItems(this.categorysStorage[this.index].score);
                this.node.append(this.scoreBtn);
            }

        } else {
            this.correctCount = 0;
        }
        this.scopeView.innerHTML = `${this.correctCount}/${Category.MAX_COUNT_QUEST}`
        
    }

    toFormQuestion():void{
        let tmpArr:Array<any> = [];
        if (this.answerType === AnswerType.text){
            tmpArr = images.slice(this.startIndex,this.endIndex);
        } else {
            this.startIndex = this.index*Category.MAX_COUNT_QUEST+120;
            this.endIndex = this.startIndex + Category.MAX_COUNT_QUEST;
            tmpArr = images.slice(this.startIndex,this.endIndex);
        }
        
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
        this.wrapper.append(this.btnWrap,this.headCategory, quest.node)
        this.container.append(this.wrapper);
        if (this.setting.timeActive){
            this.second = this.setting.timeValue;
            this.idTimer = setTimeout(()=>{this.setSecond(quest)},0);
        }
        
    }

    showScore():void{
        
        this.scoreWrapper.innerHTML = '';
        this.scoreItems.forEach((item)=>{
            this.scoreWrapper.append(item);
        })
        this.container.append(this.scoreWrapper)
    }

    async nextQuest(){
        this.currentQuest++;
        if (this.currentQuest === this.quests.length) {
            this.saveToLocalStorage();
            this.currentQuest = 0;
            this.showCongratulation();
            this.clearQuests();
            return;
        }
        await this.view.categoryHandler(this);
    }

    showCongratulation():void{
        
        let ovrContainer = document.createElement('div');
        ovrContainer.className = 'ovr_win_container';
        let headTxt = document.createElement('div');
        headTxt.className = 'head_txt';
        headTxt.innerHTML = 'congratulation!'
        let resultDiv = document.createElement('div');
        resultDiv.className = 'result';
        resultDiv.innerHTML = `${this.correctCount}/${Category.MAX_COUNT_QUEST}`;
        let miniImg = document.createElement('div');
        miniImg.className = 'win_img';
        
        
        ovrContainer.append(headTxt,resultDiv, miniImg, this.btnWrap);
        let overlay = document.createElement('div');
        overlay.className = 'ovr_win';
        overlay.append(ovrContainer);
        this.container.append(overlay);
        setTimeout(() => {
            overlay.classList.add('ovr_win_show');
        }, 300);
        if (this.setting.soundActive){
            this.endRound.play();
        }
        
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
            score:this.quests.slice(0),
        }
        this.categorysStorage[this.index] = objTmp;
        if (this.answerType === AnswerType.text){
            localStorage.setItem('artArtistCategorys',JSON.stringify(this.categorysStorage));
        } else {
            localStorage.setItem('artPictureCategorys',JSON.stringify(this.categorysStorage));
        }
        
    }

    clearResult():void{
        this.correctCount = 0;
        this.saveToLocalStorage();
    }

    setScoreItems = (arrayScore:Quest[]):void => {
        arrayScore.forEach((item)=>{
            let headScore:HTMLDivElement = document.createElement('div');
            headScore.className = 'head_preview';
            headScore.innerHTML = this.nameCategory;
            let imgScore:HTMLDivElement = document.createElement('div');
            imgScore.className = 'preview';
            let rgtAnsw:IAnswer = item.rightAnswer;
            imgScore.style.backgroundImage = `url(./assets/pictures/img/${rgtAnsw.answer.imageNum}.jpg)`;
            let scoreItem:HTMLDivElement = document.createElement('div');
            scoreItem.className = 'score_item';
            scoreItem.append(headScore,imgScore);
            if (item.isRightAnswered){
                headScore.classList.add('right_answer');
            } else {
                headScore.classList.add('no_right_answer');
                imgScore.style.filter = 'grayscale(100%)';
            }
            this.scoreItems.push(scoreItem);
        })        
    }

}