import './settings.css';
import { BaseComponent } from '../baseComponent/baseComponent';
import { ISetting } from '../interfaces/interfaces';
import { createHTMLElement } from '../helpers/helpers';


export class Settings extends BaseComponent {
    private readonly DIS_COLOR: string = '#ccc';

    private readonly ACT_COLOR: string = 'dimgray';

    private activeSound = false;

    private activeTime = false;

    private rangeTxt: HTMLElement;

    private setting: ISetting;

    public itemSound: HTMLElement;

    public itemTime: HTMLElement;

    public settingBtn: HTMLElement;

    public rangeSound: HTMLInputElement;

    public soundOff: HTMLButtonElement;

    public rangeTime: HTMLInputElement;

    public itemActiveSound: HTMLElement;

    public itemActiveTime: HTMLElement;

    public btnSave: HTMLButtonElement;

    constructor() {
        super('settings');
    }

    init(): void {
        const defaultSetting = {
            soundActive: this.activeSound,
            soundLevel: '0.0',
            timeActive: this.activeTime,
            timeValue: 10,
        };
        this.setting = JSON.parse(localStorage.getItem('arqSetting')) || defaultSetting;
        this.activeSound = this.setting.soundActive;
        this.activeTime = this.setting.timeActive;
        const itemWrapper = createHTMLElement('div', 'item_wrapper');
        this.initItemSound();
        this.initItemTime();
        itemWrapper.append(this.itemSound, this.itemTime);
        this.btnSave = <HTMLButtonElement>createHTMLElement('button', 'btn_general btn_save', 'save');
        const btnWrapper = createHTMLElement('div', 'btn_wrapper');
        btnWrapper.append(this.btnSave);
        this.node.append(itemWrapper, btnWrapper);

        this.settingBtn = createHTMLElement('div', 'btn_general setting_btn', 'Setting');

        this.activeSound = this.setting.soundActive;
        this.activeTime = this.setting.timeActive;
    }

    initItemSound(): void {
        this.itemSound = createHTMLElement('div', 'item_setting item_sound');
        this.rangeSound = <HTMLInputElement>createHTMLElement('input', 'progress');
        const soundLabel = createHTMLElement('div', 'item_label sound_label');

        const soundWrapper = createHTMLElement('div', 'sound_wrapper');

        this.soundOff = <HTMLButtonElement>createHTMLElement('button', 'sound_off');

        this.soundOff.addEventListener('click', () => {
            this.doSoundOff();
        });

        this.rangeSound.type = 'range';
        this.rangeSound.min = '0';
        this.rangeSound.max = '1';
        this.rangeSound.step = '0.02';
        this.rangeSound.value = this.setting.soundLevel.toString();

        this.rangeSound.disabled = !this.activeSound;

        soundWrapper.append(this.soundOff, this.rangeSound);

        this.itemActiveSound = createHTMLElement('div', 'active_sound');
        this.itemActiveSound.addEventListener('click', this.changeActiveSound);

        const soundTxt = createHTMLElement('div', 'item_txt', '<span>sound</span>');
        this.itemSound.append(soundLabel, soundWrapper, this.itemActiveSound, soundTxt);
        this.rangeSound.addEventListener('input', this.changeSoundRange);
        this.changeSoundRange();
        this.setItemActive(this.activeSound, this.itemActiveSound);
    }

    initItemTime(): void {
        this.itemTime = createHTMLElement('div', 'item_setting item_time');
        this.rangeTime = <HTMLInputElement>createHTMLElement('input', 'progress');
        this.rangeTime.addEventListener('input', this.changeTimeRange);
        const timeLabel = createHTMLElement('div', 'item_label time_label');
        const timeWrapper = createHTMLElement('div', 'time_wrapper');
        this.rangeTime.type = 'range';
        this.rangeTime.min = '5';
        this.rangeTime.max = '30';
        this.rangeTime.step = '5';
        this.rangeTime.value = this.setting.timeValue.toString();
        this.rangeTime.disabled = !this.activeTime;

        this.rangeTxt = createHTMLElement('div', '', `<span>${this.rangeTime.value}</span>`);
        timeWrapper.append(this.rangeTime, this.rangeTxt);

        this.itemActiveTime = createHTMLElement('div', 'active_sound');
        this.itemActiveTime.addEventListener('click', this.changeActiveTime);

        const timeTxt = createHTMLElement('div', 'item_txt', '<span>time</span>');
        this.itemTime.append(timeLabel, timeWrapper, this.itemActiveTime, timeTxt);

        this.changeTimeRange();
        this.setItemActive(this.activeTime, this.itemActiveTime);
    }

    doSoundOff(): void {
        this.rangeSound.value = '0';
        this.changeSoundRange();
    }

    changeSoundRange = () => {
        const value = parseFloat(this.rangeSound.value) * 100;
        if (!this.activeSound) {
            this.rangeSound.style.background = `linear-gradient(to right, ${this.DIS_COLOR} 0%, ${this.DIS_COLOR} ${value}%, #fff ${value}%, white 100%)`;
        } else {
            this.rangeSound.style.background = `linear-gradient(to right, ${this.ACT_COLOR} 0%, ${this.ACT_COLOR} ${value}%, #fff ${value}%, white 100%)`;
        }
    };

    changeTimeRange = () => {
        let value = 0;
        switch (parseInt(this.rangeTime.value)) {
            case 5: {
                value = 0;
                break;
            }
            case 10: {
                value = 20;
                break;
            }
            case 15: {
                value = 40;
                break;
            }
            case 20: {
                value = 60;
                break;
            }
            case 25: {
                value = 80;
                break;
            }
            case 30: {
                value = 100;
                break;
            }
        }

        this.rangeTxt.innerHTML = `<span>${this.rangeTime.value}</span>`;
        if (!this.activeTime) {
            this.rangeTime.style.background = `linear-gradient(to right, ${this.DIS_COLOR} 0%, ${this.DIS_COLOR} ${value}%, #fff ${value}%, white 100%)`;
        } else {
            this.rangeTime.style.background = `linear-gradient(to right, ${this.ACT_COLOR} 0%, ${this.ACT_COLOR} ${value}%, #fff ${value}%, white 100%)`;
        }
    };

    changeActiveSound = () => {
        this.activeSound = !this.activeSound;
        this.rangeSound.disabled = !this.activeSound;
        this.setItemActive(this.activeSound, this.itemActiveSound);
        this.changeSoundRange();
    };

    changeActiveTime = () => {
        this.activeTime = !this.activeTime;
        this.rangeTime.disabled = !this.activeTime;
        this.setItemActive(this.activeTime, this.itemActiveTime);
        this.changeTimeRange();
    };

    getActiveSound(): boolean {
        return this.activeSound;
    }

    getActiveTime(): boolean {
        return this.activeTime;
    }

    saveSettings() {
        const objSetting = {
            soundActive: this.activeSound,
            soundLevel: parseFloat(this.rangeSound.value),
            timeActive: this.activeTime,
            timeValue: parseInt(this.rangeTime.value),
        };
        this.setting = objSetting;
        localStorage.setItem('arqSetting', JSON.stringify(this.setting));
    }

    getSetting(): ISetting {
        return this.setting;
    }

    private setItemActive(isActive: boolean, item: HTMLElement) {
        if (isActive) {
            item.innerHTML = '<div class="active_item"></div>';
        } else {
            item.innerHTML = '';
        }
    }
}
