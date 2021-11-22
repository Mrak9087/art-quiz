import "./style.css";
import {images} from "./components/images";
import { Quest } from "./components/quest/quest";
import { Category } from "./components/category/category";
import { View } from "./components/view/view";

const view = new View();
view.init();
document.body.append(view.node);




