import "./menu.css";
import {BaseComponent} from "../baseComponent/baseComponent";

export class Menu extends BaseComponent{
    private menuWrapper:HTMLDivElement;

    public artistQuiz:HTMLDivElement;
    public picturesQuiz:HTMLDivElement;

    constructor(){
        super('menu_container')
        this.menuWrapper = document.createElement('div');
        this.menuWrapper.className = 'menu_wrapper';
        this.node.append(this.menuWrapper);
    }

    init(){
        let quizContainer = document.createElement('div');
        quizContainer.className = 'quiz_container';
        this.menuWrapper.append(quizContainer);
        let artImg = document.createElement('div');
        artImg.className = 'menu_img img_artist';
        let artText = document.createElement('div');
        artText.className = 'item_txt';
        artText.innerHTML = '<span>artist</span> quiz';
        this.artistQuiz = document.createElement('div');
        this.artistQuiz.className = 'menu_item';
        this.artistQuiz.append(artImg,artText);
        let picImg = document.createElement('div');
        picImg.className = 'menu_img img_picture';
        let picText = document.createElement('div');
        picText.className = 'item_txt';
        picText.innerHTML = '<span>picture</span> quiz';
        this.picturesQuiz = document.createElement('div');
        this.picturesQuiz.className = 'menu_item ';
        this.picturesQuiz.append(picImg, picText);

        quizContainer.append(this.artistQuiz, this.picturesQuiz);
    }
}