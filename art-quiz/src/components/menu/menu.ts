import './menu.css';
import { BaseComponent } from '../baseComponent/baseComponent';
import { Settings } from '../settings/settings';
import { createHTMLElement } from '../helpers/helpers';


export class Menu extends BaseComponent {
    private menuWrapper: HTMLDivElement;

    public artistQuiz: HTMLDivElement;

    public picturesQuiz: HTMLDivElement;

    public settings: Settings;

    constructor() {
        super('menu_container');
        this.menuWrapper = <HTMLDivElement>createHTMLElement('div', 'menu_wrapper');
        this.node.append(this.menuWrapper);
    }

    init() {
        const quizContainer = createHTMLElement('div', 'quiz_container');
        this.menuWrapper.append(quizContainer);
        const artImg = createHTMLElement('div', 'menu_img img_artist');
        const artText = createHTMLElement('div', 'item_txt', '<span>artist</span> quiz');
        this.artistQuiz = <HTMLDivElement>createHTMLElement('div', 'menu_item');
        this.artistQuiz.append(artImg, artText);
        const picImg = createHTMLElement('div', 'menu_img img_picture');
        const picText = createHTMLElement('div', 'item_txt', '<span>picture</span> quiz');
        this.picturesQuiz = <HTMLDivElement>createHTMLElement('div', 'menu_item');
        this.picturesQuiz.append(picImg, picText);
        quizContainer.append(this.artistQuiz, this.picturesQuiz);

        const settingContainer = createHTMLElement('div', 'setting_container');
        this.settings = new Settings();
        this.settings.init();
        settingContainer.append(this.settings.settingBtn);

        this.menuWrapper.append(settingContainer);
    }
}
