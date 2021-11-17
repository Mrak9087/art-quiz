import './view.css';
import {BaseComponent} from '../baseComponent/baseComponent';
import {images} from "../images";
import {Category} from "../category/category";
import {AnswerType} from "../enums/enums";

export class View extends BaseComponent{
    readonly countCategory: number;
    private categories: Category[]; 
    public container:HTMLDivElement;
    constructor(){
        super('view');
        this.container = document.createElement('div');
        this.container.className = 'container';
        this.countCategory = Math.floor(images.length / Category.MAX_COUNT_QUEST);
        this.categories = [];
        for(let i = 0; i < this.countCategory; i++){
            const category = new Category(i);
            category.init(this.container, this, AnswerType.img); //, AnswerType.img
            this.categories.push(category);
        }
        //
        this.addEventToCategory();
        this.node.append(this.container);
    }

    showCategories():void{
        this.categories.forEach((item) => {
            this.container.append(item.node);
        })
    }

    

    addEventToCategory():void{
        this.categories.forEach((item)=>{
            item.node.addEventListener('click', ()=>{
                this.categoryHandler(item);
            })
        })
    }

    async categoryHandler(category:Category){
        await this.doContainer(true);
        category.showQuest();
        await this.doContainer(false);
    }

    doContainer(hid:boolean): Promise<void>{
        return new Promise((resolve)=>{
            if (hid) {
                this.container.classList.add('hidden');
            } else {
                this.container.classList.remove('hidden');
            }
            this.container.addEventListener('transitionend', ()=>{
                resolve();
            })
        })
    }

}