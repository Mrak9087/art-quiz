import './answer.css';
import { BaseComponent } from '../baseComponent/baseComponent';
import { IAnswerContent } from '../interfaces/interfaces';
import { AnswerType } from '../enums/enums';

export class Answer extends BaseComponent {
  private isRight:boolean;

  private answerContent:IAnswerContent;

  private type: AnswerType;

  constructor(answerContent:IAnswerContent, isRight:boolean, type:AnswerType = AnswerType.img) {
    super('answer');
    this.isRight = isRight;
    this.answerContent = answerContent;
    this.type = type;
    if (this.type === AnswerType.text) {
      this.node.innerHTML = this.answerContent.author;
    }
    if (this.type === AnswerType.img) {
      this.node.style.cssText = `background-image:url(./assets/pictures/img/${this.answerContent.imageNum}.jpg)`;
      this.node.classList.add('type_img');
    }
  }

  getRight():boolean {
    return this.isRight;
  }

  getAnswer():IAnswerContent {
    return this.answerContent;
  }
}
