import './view.css';
import {BaseComponent} from '../baseComponent/baseComponent';
import {images} from "../images";
import {Category} from "../category/category";
import {AnswerType} from "../enums/enums";
import {Menu} from "../menu/menu";
import { Settings } from '../settings/settings';
import { Answer } from '../answer/answer';
import {ISetting} from '../interfaces/interfaces';

export class View extends BaseComponent{
    readonly countCategory: number;
    private categories: Category[]; 
    private menu: Menu;
    private settings: Settings;
    private type:AnswerType = AnswerType.img;
    private setting: ISetting;
    public categoryContainer:HTMLDivElement;
    public container:HTMLDivElement;

    constructor(){
        super('view');
        this.countCategory = Math.floor(images.length / Category.MAX_COUNT_QUEST);
    }

    init():void{
        this.setting = JSON.parse(localStorage.getItem('arqSetting')) || {
            soundActive: false,
            soundLevel: 0,
            timeActive: false,
            timeValue:0,
        }
        this.container = document.createElement('div');
        this.container.className = 'container';
        this.categoryContainer = document.createElement('div');
        this.categoryContainer.className = 'category_container';
        
        this.categories = [];
        this.menu = new Menu();
        this.menu.init();
        this.addEventToMenu()
        this.container.append(this.menu.node);
        this.node.append(this.container);
    }

    createCategories():Promise<void>{
        return new Promise((resolve) =>{
            this.categories.splice(0, this.categories.length); 
            for(let i = 0; i < this.countCategory; i++){
                const category = new Category(i);
                category.init(this.container, this, this.setting, this.type); //, AnswerType.img
                this.categories.push(category);
            }
            this.addEventToCategory();
            this.categories.forEach((item) => {
                this.categoryContainer.append(item.node);
            })
            resolve();
        })
    }

    addEventToCategory():void{
        this.categories.forEach((item)=>{
            item.node.addEventListener('click', ()=>{
                item.clearResult();
                this.categoryHandler(item);
            })
        })
    }

    addEventToMenu():void{
        this.menu.artistQuiz.addEventListener('click', async ()=>{
            this.type = AnswerType.text;
            await this.showCategories()
        })

        this.menu.picturesQuiz.addEventListener('click', async ()=>{
            this.type = AnswerType.img;
            await this.showCategories()
        })

        this.menu.settings.settingBtn.addEventListener('click', async ()=>{
            await this.showSetting();
        })

        this.menu.settings.btnSave.addEventListener('click', async ()=>{
            this.menu.settings.saveSettings();
            this.setting = this.menu.settings.getSetting();
            await this.showMenu();
            console.log(this.setting);
        })
    }

    async showCategories(){
        await this.doContainer(true);
        this.container.innerHTML = '';
        this.container.append(this.categoryContainer);
        await this.createCategories();
        await this.doContainer(false);
    }

    async showMenu(){
        await this.doContainer(true);
        this.container.innerHTML = '';
        this.container.append(this.menu.node)
        await this.doContainer(false);
    }

    async showSetting(){
        await this.doContainer(true);
        
        this.container.innerHTML = '';
        this.container.append(this.menu.settings.node);
        await this.doContainer(false);
    }

    async categoryHandler(category:Category){
        await this.doContainer(true);
        category.showQuest();
        await this.doContainer(false);
    }

    doContainer (hid:boolean): Promise<void>{
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