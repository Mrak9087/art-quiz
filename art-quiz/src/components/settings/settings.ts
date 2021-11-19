import './settings.css';
import {BaseComponent} from '../baseComponent/baseComponent';



export class Settings extends BaseComponent{

    private activeSound: boolean = false;
    private activeTime: boolean = false;
    private rangeTxt: HTMLDivElement;
    public itemSound: HTMLDivElement;
    public itemTime: HTMLDivElement;
    public settingBtn: HTMLDivElement;
    public rangeSound: HTMLInputElement;
    public soundOff: HTMLButtonElement;
    public rangeTime: HTMLInputElement;
    public itemActiveSound: HTMLDivElement;
    public itemActiveTime: HTMLDivElement;
    public btnSave: HTMLButtonElement;


    constructor(){
        super('settings');
    }

    init():void{
        const itemWrapper:HTMLDivElement = document.createElement('div');
        itemWrapper.className = 'item_wrapper';
        this.initItemSound();
        this.initItemTime();
        itemWrapper.append(this.itemSound, this.itemTime);
        this.btnSave = document.createElement('button');
        this.btnSave.className = 'btn_general btn_save';
        this.btnSave.innerHTML = 'save';
        const btnWrapper:HTMLDivElement = document.createElement('div');
        btnWrapper.className = 'btn_wrapper';
        btnWrapper.append(this.btnSave);
        this.node.append(itemWrapper, btnWrapper);

        this.settingBtn = document.createElement('div');
        this.settingBtn.className = 'btn_general setting_btn'; 
        this.settingBtn.innerHTML = 'Setting';
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
        this.rangeSound.value = '0.5';
        soundWrapper.append(this.soundOff, this.rangeSound);

        this.itemActiveSound = document.createElement('div');
        this.itemActiveSound.className = 'active_sound';
        this.itemActiveSound.addEventListener('click',this.changeActiveSound);

        const soundTxt = document.createElement('div');
        soundTxt.className = 'item_txt';
        soundTxt.innerHTML = '<span>sound</span>';
        this.itemSound.append(soundLabel,soundWrapper, this.itemActiveSound, soundTxt);
        this.rangeSound.addEventListener('input', this.changeSoundRange);
        
    }

    initItemTime():void{
        this.itemTime = document.createElement('div');
        this.itemTime.className = 'item_setting item_time';
        this.rangeTime = document.createElement('input');
        this.rangeTime.className = 'progress';
        this.rangeTime.addEventListener('input', this.changeTimeRange);
        const timeLabel = document.createElement('div');
        timeLabel.className = 'item_label time_label';
        const timeWrapper = document.createElement('div');
        timeWrapper.className = 'time_wrapper';
        this.rangeTime.type = 'range';
        this.rangeTime.min = '5';
        this.rangeTime.max = '30';
        this.rangeTime.step = '5';
        this.rangeTime.value = '10';
        this.rangeTxt = document.createElement('div');
        this.rangeTxt.innerHTML = `<span>${this.rangeTime.value}</span>`;
        timeWrapper.append(this.rangeTime,this.rangeTxt);

        this.itemActiveTime = document.createElement('div');
        this.itemActiveTime.className = 'active_sound';
        this.itemActiveTime.addEventListener('click',this.changeActiveTime);
        
        const timeTxt = document.createElement('div');
        timeTxt.className = 'item_txt';
        timeTxt.innerHTML = '<span>time</span>';
        this.itemTime.append(timeLabel,timeWrapper,this.itemActiveTime,timeTxt);
        
        
    }

    changeSoundRange = () => {
        let value = parseFloat(this.rangeSound.value) * 100;
        this.rangeSound.style.background = `linear-gradient(to right, dimgray 0%, dimgray ${value}%, #fff ${value}%, white 100%)`;
    }

    changeTimeRange = () => {
        // let value = Math.floor(parseFloat(this.rangeTime.value) / 10) * 20;
        // if (value % 10) value += 20
        // console.log(this.rangeTime.value, value);
        let value = 15;
        this.rangeTxt.innerHTML = `<span>${this.rangeTime.value}</span>`;
        // this.rangeTime.style.background = `linear-gradient(to right, dimgray 0%, dimgray ${}%, #fff ${TMP[+this.rangeTime.value]}%, white 100%)`;
    }

    changeActiveSound = () => {
        this.activeSound = !this.activeSound;
        this.setItemActive(this.activeSound, this.itemActiveSound)
    }

    changeActiveTime = () => {
        this.activeTime = !this.activeTime;
        this.setItemActive(this.activeTime, this.itemActiveTime)
    }

    getActiveSound():boolean{
        return this.activeSound;
    }

    getActiveTime():boolean{
        return this.activeTime;
    }

    private setItemActive(isActive:boolean, item:HTMLDivElement){
        if (isActive){
            item.innerHTML = '<div class="active_item"></div>'
        } else {
            item.innerHTML = '';
        }
    }
}