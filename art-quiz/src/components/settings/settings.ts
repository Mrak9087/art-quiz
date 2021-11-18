import './settings.css';
import {BaseComponent} from '../baseComponent/baseComponent';

export class Settings extends BaseComponent{
    
    public itemSound: HTMLDivElement;
    public itemTime: HTMLDivElement;
    public settingBtn: HTMLDivElement;
    public rangeSound: HTMLInputElement;
    public soundOff: HTMLButtonElement;
    public rangeTime: HTMLInputElement;

    constructor(){
        super('settings');
    }

    init():void{
        this.initItemSound();
        this.initItemTime();
        this.node.append(this.itemSound, this.itemTime);
    }

    initItemSound():void{
        this.itemSound = document.createElement('div');
        this.itemSound.className = 'item_setting item_sound';
        this.rangeSound = document.createElement('input');
        this.rangeSound.className = 'progress';
        const soundLabel = document.createElement('div');
        soundLabel.className = 'item_label sound_label';
        
        const soundWrapper = document.createElement('div');
        soundWrapper.className = 'sound_wrapper';


        this.soundOff = document.createElement('button');
        this.soundOff = document.createElement('button');
        this.soundOff.className = 'sound_off';
        this.rangeSound.type = 'range';
        this.rangeSound.min = '0';
        this.rangeSound.max = '1';
        this.rangeSound.step = '0.02';
        soundWrapper.append(this.soundOff, this.rangeSound);
        
        const soundTxt = document.createElement('div');
        soundTxt.className = 'item_txt';
        soundTxt.innerHTML = '<span>sound</span>';
        this.itemSound.append(soundLabel,soundWrapper,soundTxt);
        
    }

    initItemTime():void{
        this.itemTime = document.createElement('div');
        this.itemTime.className = 'item_setting item_time';
        this.rangeTime = document.createElement('input');
        this.rangeTime.className = 'progress';
        const timeLabel = document.createElement('div');
        timeLabel.className = 'item_label time_label';
        const timeWrapper = document.createElement('div');
        timeWrapper.className = 'time_wrapper';
        this.rangeTime.type = 'range';
        this.rangeTime.min = '5';
        this.rangeTime.max = '30';
        this.rangeTime.step = '5';
        this.rangeTime.value = '10';
        const rangeTxt = document.createElement('div');
        timeWrapper.append(this.rangeTime,rangeTxt);
        
        const timeTxt = document.createElement('div');
        timeTxt.className = 'item_txt';
        timeTxt.innerHTML = '<span>time</span>';
        this.itemTime.append(timeLabel,timeWrapper,timeTxt);
        
    }
}