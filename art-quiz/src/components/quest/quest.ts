import { Answer } from "../answer/answer";
import { BaseComponent } from "../baseComponent/baseComponent";

export class Quest extends BaseComponent{
    private answers: Answer[];
    private question: HTMLElement;//Question;
    constructor(private readonly parentNode:HTMLElement){
        super(parentNode, 'quest');
    }


}