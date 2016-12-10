import { LocalStorage } from 'node-localstorage';

export class LetterBag {

    private localStorage: LocalStorage;

    constructor() {
        this.localStorage = new LocalStorage('./storage');
    }

    public removeLetterFrom(userName) {
        this.localStorage.removeItem(userName);
    }
    public getLetterFrom(userName) {
        return this.localStorage.getItem(userName);
    }

    public modifyLetterFrom(userName, ps) {
        let letter = this.getLetterFrom(userName);
        this.localStorage.setItem(userName, letter + '\nPS ' + ps);
    }

    public addLetterFrom(userName, message) {
        this.localStorage.setItem(userName, message);
    }

}