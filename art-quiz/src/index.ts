import "./style.css";
import {images} from "./components/images";
import { Quest } from "./components/quest/quest";
import { Category } from "./components/category/category";
import { View } from "./components/view/view";

const view = new View();
view.init();
document.body.append(view.node);

console.log(
    '1. Стартовая страница и навигация +20 \n'+ 
    '2. Настройки +40 \n'+
    '3. Страница категорий +30 \n'+
    '4. Страница с вопросами +50 \n'+ 
    '5. Страница с результатами +50 \n'+
    '6. Плавная смена изображений +10 \n'+
    '7. Реализована анимация отдельных деталей интерфейса + 20 \n'+
    'Итого: 220'
);


