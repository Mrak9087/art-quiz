import './view.css';
import { BaseComponent } from '../baseComponent/baseComponent';
import { Category } from '../category/category';
import { AnswerType } from '../enums/enums';
import { Menu } from '../menu/menu';
import { Settings } from '../settings/settings';
import { ISetting, IAnswerContent } from '../interfaces/interfaces';

export class View extends BaseComponent {
    private countCategory: number;

    private categories: Category[];

    private menu: Menu;

    private settings: Settings;

    private type: AnswerType = AnswerType.img;

    private setting: ISetting;

    private btnHome: HTMLButtonElement;

    public categoryContainer: HTMLDivElement;

    public container: HTMLDivElement;

    public logoWrapper: HTMLDivElement;

    public logo: HTMLDivElement;

    public footer: HTMLDivElement;

    private images: IAnswerContent[];

    constructor() {
        super('view');
    }

    async init() {
        this.setting = JSON.parse(localStorage.getItem('arqSetting')) || {
            soundActive: false,
            soundLevel: 0,
            timeActive: false,
            timeValue: 0,
        };
        const res = await fetch(`./assets/pictures/images.json`);
        const data = await res.json();
        this.images = data.slice(0);
        this.countCategory = Math.floor(this.images.length / Category.MAX_COUNT_QUEST) / 2;
        this.container = document.createElement('div');
        this.container.className = 'container';
        this.categoryContainer = document.createElement('div');
        this.categoryContainer.className = 'category_container';

        this.btnHome = document.createElement('button');
        this.btnHome.className = 'btn_home';
        this.btnHome.innerHTML = 'home';
        this.btnHome.addEventListener('click', async () => {
            this.showMenu();
        });
        this.logoWrapper = document.createElement('div');
        this.logoWrapper.className = 'logo_wrapper';
        this.logo = document.createElement('div');
        this.logo.className = 'logo';
        this.logoWrapper.append(this.logo);
        this.categories = [];
        this.menu = new Menu();
        this.menu.init();
        this.addEventToMenu();
        this.container.append(this.logoWrapper, this.menu.node);
        this.footer = document.createElement('div');
        this.footer.className = 'footer';
        this.footer.innerHTML = `<div class="footer_container">
                <a class="github" href="https://github.com/Mrak9087" target="blank">Mrak9087</a>
                <span class="rss_year">2021</span>
                <a class="rss" href="https://rs.school/js/" target="_blank" rel="noopener noreferrer">
                    
                </a>
            </div>`;
        this.node.append(this.container, this.footer);
    }

    createCategories(): Promise<void> {
        return new Promise((resolve) => {
            this.categories.splice(0, this.categories.length);
            for (let i = 0; i < this.countCategory; i++) {
                const category = new Category(i);
                category.init(this.container, this, this.setting, this.type); // , AnswerType.img
                this.categories.push(category);
            }
            this.addEventToCategory();
            this.categories.forEach((item) => {
                this.categoryContainer.append(item.node);
            });
            resolve();
        });
    }

    addEventToCategory(): void {
        this.categories.forEach((item) => {
            item.node.addEventListener('click', () => {
                item.clearResult();
                this.categoryHandler(item);
            });
        });
    }

    addEventToMenu(): void {
        this.menu.artistQuiz.addEventListener('click', async () => {
            this.type = AnswerType.text;
            await this.showCategories();
        });

        this.menu.picturesQuiz.addEventListener('click', async () => {
            this.type = AnswerType.img;
            await this.showCategories();
        });

        this.menu.settings.settingBtn.addEventListener('click', async () => {
            await this.showSetting();
        });

        this.menu.settings.btnSave.addEventListener('click', async () => {
            this.menu.settings.saveSettings();
            this.setting = this.menu.settings.getSetting();
            await this.showMenu();
            console.log(this.setting);
        });
    }

    addBtnHome(): void {
        const btnContainer = document.createElement('div');
        btnContainer.className = 'btn_container';
        btnContainer.append(this.btnHome);
        this.container.append(btnContainer);
    }

    async showCategories() {
        await this.doContainer(true);
        this.container.innerHTML = '';
        this.categoryContainer.innerHTML = '';
        this.addBtnHome();
        this.container.append(this.categoryContainer);
        await this.createCategories();
        await this.doContainer(false);
    }

    async showScore(category: Category) {
        await this.doContainer(true);
        this.container.innerHTML = '';
        this.addBtnHome();
        category.showScore();
        await this.doContainer(false);
    }

    async showMenu() {
        await this.doContainer(true);
        this.container.innerHTML = '';
        this.container.append(this.logoWrapper, this.menu.node);
        await this.doContainer(false);
    }

    async showSetting() {
        await this.doContainer(true);

        this.container.innerHTML = '';
        this.addBtnHome();
        this.container.append(this.menu.settings.node);
        await this.doContainer(false);
    }

    async categoryHandler(category: Category) {
        await this.doContainer(true);
        category.showQuest();
        // category.showScore()
        await this.doContainer(false);
    }

    doContainer(hid: boolean): Promise<void> {
        return new Promise((resolve) => {
            if (hid) {
                this.container.classList.add('hidden');
            } else {
                this.container.classList.remove('hidden');
            }
            this.container.addEventListener('transitionend', () => {
                resolve();
            });
        });
    }
}
