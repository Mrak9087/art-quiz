import {images} from "./components/images";
import { Quest } from "./components/quest/quest";

const getRandomNum = (min:number, max:number):number => {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

function shuffle(array:Array<any>):Array<any> {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

const qst = images.slice(0,10);

console.log(qst);

let arrAnswerObj:{right:boolean, answer:{author: string,name: string,year: string,imageNum: string}}[] = [];

const quest = new Quest();
let rg = getRandomNum(0,9);

arrAnswerObj.push({right:true,answer:qst[rg]});

for (let i = 0; i<3; i++){
    let tmp = getRandomNum(0,9);
    while (tmp === rg){
        tmp = getRandomNum(0,9);
    }
    arrAnswerObj.push({right:false,answer:qst[tmp]});
};

console.log(arrAnswerObj);

arrAnswerObj = shuffle(arrAnswerObj);
console.log(arrAnswerObj);

let img = new Image();
img.src = `./assets/img/${qst[rg].imageNum}.jpg`;
img.alt = `${rg}`;

quest.init([img],arrAnswerObj);

document.body.append(quest.node);



