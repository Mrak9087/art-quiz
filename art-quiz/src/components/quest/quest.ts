import './quest.css';
import { Answer } from '../answer/answer';
import { BaseComponent } from '../baseComponent/baseComponent';
import { IAnswer } from '../interfaces/interfaces';
import { AnswerType } from '../enums/enums';

export class Quest extends BaseComponent {
    private answers: Answer[] = [];

    private question = 'Кто автор картины?';

    private questImages: HTMLElement;

    private questAnswer: HTMLElement;

    private isAnswered = false;

    private type: AnswerType;

    public isRightAnswered = false;

    public rightAnswer: IAnswer;

    public overlay: HTMLDivElement;

    public btnNext: HTMLElement;

    constructor(type: AnswerType = AnswerType.text) {
        super('quest');
        this.type = type;
    }

    init(questImages: HTMLElement, arrAnswerObj: IAnswer[]): void {
        this.overlay = document.createElement('div');
        this.overlay.className = 'answer_overlay ovr_hidden';

        this.btnNext = document.createElement('div');
        this.btnNext.className = 'btn_next';
        this.btnNext.innerText = 'Next';
        this.questImages = document.createElement('div');
        this.questImages.className = 'quest_images';
        if (questImages) {
            this.questImages.append(questImages);
        }
        this.questAnswer = document.createElement('div');
        this.questAnswer.className = 'answer_container';
        arrAnswerObj.forEach((item) => {
            const answerObj = new Answer(item.answer, item.right, this.type);
            this.answers.push(answerObj);
            this.questAnswer.append(answerObj.node);
            if (item.right) this.rightAnswer = item;
        });
        if (this.type === AnswerType.img) {
            this.question = `Какую картину написал ${this.rightAnswer.answer.author}?`;
        }
        this.node.append(this.questImages, this.questAnswer);
    }

    getRightAnswer(): IAnswer {
        return this.rightAnswer;
    }

    answered(isRight: boolean): void {
        this.isAnswered = true;
        this.showRightAnswer(isRight);
    }

    getAnswered(): boolean {
        return this.isAnswered;
    }

    getAnswers(): Array<Answer> {
        return this.answers;
    }

    setQuestion(question: string): void {
        this.question = question;
    }

    getQuestion(): string {
        return this.question;
    }

    showRightAnswer(isRight: boolean) {
        this.isRightAnswered = isRight;
        const ovrContainer = document.createElement('div');
        ovrContainer.className = 'ovr_container';
        const okErr = document.createElement('div');
        okErr.className = 'ok_error';
        if (isRight) {
            okErr.classList.add('ok');
        } else {
            okErr.classList.add('error');
        }
        const miniImg = document.createElement('div');
        miniImg.className = 'mini_img';
        miniImg.style.cssText = `background-image:url(./assets/pictures/img/${this.rightAnswer.answer.imageNum}.jpg)`;
        const picInfo = document.createElement('div');
        picInfo.className = 'picture_info';
        picInfo.innerHTML = `
            <span>${this.rightAnswer.answer.author}</span>
            <span>${this.rightAnswer.answer.name}</span>
            <span>${this.rightAnswer.answer.year}</span>
            `;
        ovrContainer.append(okErr, miniImg, picInfo, this.btnNext);

        this.overlay.append(ovrContainer);
        this.node.append(this.overlay);
        setTimeout(() => {
            this.overlay.classList.remove('ovr_hidden');
        }, 10);
    }

    clearAnswered() {
        this.isAnswered = false;
    }

    getIsRightAnswered(): boolean {
        return this.isRightAnswered;
    }
}
