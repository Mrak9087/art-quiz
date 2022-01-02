import './category.css';

import { Quest } from '../quest/quest';
import { images } from '../images';
import { Answer } from '../answer/answer';
import { IAnswer, ISetting, IStorageCategory, IAnswerContent} from '../interfaces/interfaces';
import { BaseComponent } from '../baseComponent/baseComponent';
import { View } from '../view/view';
import { AnswerType } from '../enums/enums';
import ok from '../../assets/sounds/correctanswer.mp3';
import wrong from '../../assets/sounds/wronganswer.mp3';
import endround from '../../assets/sounds/endround.mp3';
import {createHTMLElement, getRandomNum} from '../helpers/helpers';

export class Category extends BaseComponent {
    static readonly MAX_COUNT_QUEST: number = 10;
    readonly PICTURE_QUIZ_START: number = 120;

    private quests: Quest[];

    private correctCount: number;

    private startIndex: number;

    private endIndex: number;

    private headPreView: HTMLElement;

    private scopeView: HTMLElement;

    private infoDiv: HTMLElement;

    private imgPreView: HTMLElement;

    private currentQuest: number;

    private container: HTMLElement;

    private view: View;

    private answerType: AnswerType;

    private setting: ISetting;

    private okAnswer: HTMLAudioElement;

    private wrongAnswer: HTMLAudioElement;

    private endRound: HTMLAudioElement;

    private second: number;

    private questTxt: HTMLElement;

    private questTime: HTMLElement;

    private headCategory: HTMLElement;

    private wrapper: HTMLElement;

    private scoreWrapper: HTMLElement;

    private idTimer: NodeJS.Timeout;

    private nameCategory: string;

    private scoreContainer: HTMLElement;

    private scoreItems: HTMLElement[];

    private scoreBtn: HTMLElement;

    private btnHome: HTMLElement;

    private btnCat: HTMLElement;

    private btnWrap: HTMLElement;

    private bulletContainer: HTMLElement;

    private bullets: HTMLElement[] = [];

    private categorysStorage: IStorageCategory[];

    constructor(private readonly index: number) {
        super('category');
        this.startIndex = this.index * Category.MAX_COUNT_QUEST;
        this.endIndex = this.startIndex + Category.MAX_COUNT_QUEST;
        this.quests = [];
        this.scoreItems = [];
        this.correctCount = 0;
        this.currentQuest = 0;
        this.second = 30;
        this.nameCategory = `Категория ${this.index + 1}`;
    }

    init(container: HTMLDivElement, view: View, setting: ISetting, answerType: AnswerType = AnswerType.text): void {
        if (answerType === AnswerType.text) {
            this.categorysStorage = JSON.parse(localStorage.getItem('artArtistCategorys')) || [];
        } else {
            this.categorysStorage = JSON.parse(localStorage.getItem('artPictureCategorys')) || [];
        }
        this.btnHome = createHTMLElement('button', 'btn_win', 'home');
        this.btnHome.addEventListener('click', () => {
            clearTimeout(this.idTimer);
            this.view.showMenu();
        });

        this.btnCat = createHTMLElement('button', 'btn_win', 'category');
        this.btnCat.addEventListener('click', () => {
            clearTimeout(this.idTimer);
            this.view.showCategories();
        });

        this.btnWrap = createHTMLElement('div', 'btn_wrap');
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
        this.infoDiv = createHTMLElement('div', 'cat_name');

        this.scoreBtn = createHTMLElement('button', 'score_btn', 'score');
        this.scoreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            view.showScore(this);
        });
        this.infoDiv.innerHTML = this.nameCategory;
        this.scopeView = createHTMLElement('div', 'score_view');

        this.headPreView = createHTMLElement('div', 'head_preview');
        this.headPreView.append(this.infoDiv, this.scopeView);
        this.imgPreView = createHTMLElement('div', 'preview');
        if (this.answerType === AnswerType.text) {
            this.imgPreView.style.backgroundImage = `url(./assets/pictures/img/${
                this.index * Category.MAX_COUNT_QUEST
            }.jpg)`;
        } else {
            this.imgPreView.style.backgroundImage = `url(./assets/pictures/img/${
                this.index * Category.MAX_COUNT_QUEST + this.PICTURE_QUIZ_START
            }.jpg)`;
        }

        if (!this.categorysStorage[this.index]) {
            this.imgPreView.style.filter = 'grayscale(100%)';
        }
        this.toFormQuestion();

        this.headCategory = createHTMLElement('div', 'head_category');
        this.questTxt = createHTMLElement('div', 'quest_txt');
        this.questTime = createHTMLElement('div', 'quest_time');
        this.headCategory.append(this.questTxt, this.questTime);
        this.wrapper = createHTMLElement('div', 'category_wrapper');
        this.wrapper.append(this.headCategory);
        this.bulletContainer = createHTMLElement('div', 'bullet_container');

        this.scoreWrapper = createHTMLElement('div', 'score_wrapper');
        this.node.append(this.headPreView, this.imgPreView);

        if (this.categorysStorage[this.index]) {
            this.correctCount = this.categorysStorage[this.index].correctCount || 0;
            if (this.categorysStorage[this.index].score.length) {
                this.setScoreItems(this.categorysStorage[this.index].score);
                this.node.append(this.scoreBtn);
            }
        } else {
            this.correctCount = 0;
        }
        this.scopeView.innerHTML = `${this.correctCount}/${Category.MAX_COUNT_QUEST}`;
        this.createBullet();
    }

    createBullet() {
        this.bulletContainer.innerHTML = '';
        this.bullets.splice(0, -1);
        for (let i = 0; i < Category.MAX_COUNT_QUEST; i++) {
            const bullet = createHTMLElement('div', 'bullet');
            this.bullets.push(bullet);
        }
        this.bullets.forEach((item) => {
            this.bulletContainer.append(item);
        });
    }

    toFormQuestion(): void {
        let tmpArr: Array<IAnswerContent> = [];
        if (this.answerType === AnswerType.text) {
            tmpArr = images.slice(this.startIndex, this.endIndex);
        } else {
            this.startIndex = this.index * Category.MAX_COUNT_QUEST + this.PICTURE_QUIZ_START;
            this.endIndex = this.startIndex + Category.MAX_COUNT_QUEST;
            tmpArr = images.slice(this.startIndex, this.endIndex);
        }

        tmpArr.forEach((item) => {
            let answers: IAnswer[] = [];

            answers.push({ right: true, answer: item });
            this.addIncorrectAnswers(answers);
            answers = this.shuffleAnswer(answers);
            const quest = new Quest(this.answerType);
            if (this.answerType === AnswerType.text) {
                const questImages = createHTMLElement('div', 'quest_img');
                questImages.style.cssText = `background-image:url(./assets/pictures/img/${item.imageNum}.jpg)`;
                quest.init(questImages, answers);
            } else {
                quest.init(null, answers);
            }

            quest.btnNext.addEventListener('click', () => {
                this.nextQuest();
            });
            this.quests.push(quest);
        });
        this.addEventToAnswer();
    }

    addIncorrectAnswers(answers: IAnswer[]): void {
        let incorrectIndex = getRandomNum(0, 9);
        for (let i = 0; i < 3; i++) {
            while (answers.find((item) => item.answer.author === images[incorrectIndex].author)) {
                incorrectIndex = getRandomNum(0, images.length - 1);
            }
            answers.push({ right: false, answer: images[incorrectIndex] });
        }
    }

    addEventToAnswer(): void {
        this.quests.forEach((quest) => {
            quest.getAnswers().forEach((answer) => {
                answer.node.addEventListener('click', () => {
                    this.answerHandler(quest, answer);
                });
            });
        });
    }

    shuffleAnswer(array: Array<IAnswer>): Array<IAnswer> {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    answerHandler(quest: Quest, answer: Answer) {
        if (!quest.getAnswered()) {
            if (answer.getRight()) {
                if (this.setting.soundActive) {
                    this.okAnswer.play();
                }
                this.bullets[this.currentQuest].classList.add('ans_cor');
                this.correctCount++;
                answer.node.classList.add('correct');
                quest.answered(true);
            } else {
                if (this.setting.soundActive) {
                    this.wrongAnswer.play();
                }
                this.bullets[this.currentQuest].classList.add('ans_err');

                answer.node.classList.add('incorrect');
                quest.answered(false);
            }
        }
        clearTimeout(this.idTimer);
    }

    getQuests(): Array<Quest> {
        return this.quests;
    }

    showQuest(): void {
        this.container.innerHTML = '';
        this.wrapper.innerHTML = '';
        const quest = this.quests[this.currentQuest];
        this.questTxt.innerHTML = quest.getQuestion();
        this.wrapper.append(this.btnWrap, this.headCategory, this.bulletContainer, quest.node);
        this.container.append(this.wrapper);
        if (this.setting.timeActive) {
            this.second = this.setting.timeValue;
            this.idTimer = setTimeout(() => {
                this.setSecond(quest);
            }, 1000);
        }
    }

    showScore(): void {
        this.scoreWrapper.innerHTML = '';
        this.scoreItems.forEach((item) => {
            this.scoreWrapper.append(item);
        });
        this.container.append(this.scoreWrapper);
    }

    async nextQuest() {
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

    showCongratulation(): void {
        const ovrContainer = createHTMLElement('div', 'ovr_win_container');
        const headTxt = createHTMLElement('div', 'head_txt', 'congratulation!');
        const resultDiv = createHTMLElement('div', 'resilt');
        resultDiv.innerHTML = `${this.correctCount}/${Category.MAX_COUNT_QUEST}`;
        const miniImg = createHTMLElement('div', 'win_img');

        ovrContainer.append(headTxt, resultDiv, miniImg, this.btnWrap);
        const overlay = createHTMLElement('div', 'ovr_win');
        overlay.append(ovrContainer);
        this.container.append(overlay);
        setTimeout(() => {
            overlay.classList.add('ovr_win_show');
        }, 300);
        if (this.setting.soundActive) {
            this.endRound.play();
        }
    }

    clearQuests() {
        this.quests.splice(0, this.quests.length);
        this.correctCount = 0;
        this.toFormQuestion();
    }

    setSecond(quest: Quest) {
        this.second--;
        this.questTime.innerHTML = this.addZero(this.second);
        if (!this.second) {
            if (this.setting.soundActive) {
                this.wrongAnswer.play();
            }
            quest.answered(false);
            clearTimeout(this.idTimer);
        } else {
            this.idTimer = setTimeout(() => {
                this.setSecond(quest);
            }, 1000);
        }
    }

    addZero(n: number): string {
        return (n < 10 ? '0' : '') + n;
    }

    saveToLocalStorage(): void {
        const objTmp = {
            correctCount: this.correctCount,
            score: this.quests.slice(0),
        };
        this.categorysStorage[this.index] = objTmp;
        if (this.answerType === AnswerType.text) {
            localStorage.setItem('artArtistCategorys', JSON.stringify(this.categorysStorage));
        } else {
            localStorage.setItem('artPictureCategorys', JSON.stringify(this.categorysStorage));
        }
    }

    clearResult(): void {
        this.correctCount = 0;
        this.saveToLocalStorage();
    }

    setScoreItems = (arrayScore: Quest[]): void => {
        arrayScore.forEach((item) => {
            const headScore = createHTMLElement('div', 'head_preview', this.nameCategory);
            const imgScore = createHTMLElement('div', 'preview');
            const rgtAnsw: IAnswer = item.rightAnswer;
            imgScore.style.backgroundImage = `url(./assets/pictures/img/${rgtAnsw.answer.imageNum}.jpg)`;
            const scoreItem: HTMLElement = createHTMLElement('div', 'score_item');

            const iteminfo: HTMLElement = createHTMLElement('div', 'item_info_score');
            iteminfo.innerHTML = `
                <span>${rgtAnsw.answer.author}</span>
                <span>${rgtAnsw.answer.name}</span>
                <span>${rgtAnsw.answer.year}</span>
            `;

            scoreItem.append(headScore, imgScore, iteminfo);
            scoreItem.addEventListener('click', () => {
                scoreItem.classList.toggle('info_score_show');
            });
            if (item.isRightAnswered) {
                headScore.classList.add('right_answer');
            } else {
                headScore.classList.add('no_right_answer');
                imgScore.style.filter = 'grayscale(100%)';
            }
            this.scoreItems.push(scoreItem);
        });
    };
}
