import { Client } from 'discord.io';
import { LetterBag } from './LetterBag';

export class Derpy {

    private discordClient: Client;
    private letterBag: LetterBag;

    constructor(authToken: string) {

        this.discordClient = new Client(
            {
                autorun: true,
                token: authToken
            });
        this.getReady();
    }

    private getReady() {

        this.discordClient.on('ready', () => {
            this.discordClient.connect();
            console.log('derpy is up and ready to take and deliver letters');
        });

        this.discordClient.on('message', (user, userID, channelID, message, rawEvent) => {
            if (user === this.discordClient.username) {
                return;
            }
            if (message.startsWith("!derpy")) {
                message = message.substring(6).trim();
                this.parseCommand(user, channelID, message);
            }
        });
    }

    private parseCommand(userName: string, channelID: string, message: string) {
        if (message.startsWith('help') || message.trim() == '') {
            this.greet(channelID, userName);
        } else if (message.startsWith('say')) {
            this.say(channelID, message.substring('say'.length));
        } else if (message.startsWith('take a letter')) {
            this.letterBag.addLetterFrom(userName, message.substring('take a letter'.length).trim());
            this.say(channelID, `got your letter ${userName}`);
        } else if (message.startsWith('ps')) {
            let letter = this.letterBag.getLetterFrom(userName);
            if (letter == null) {
                this.say(channelID, `I haven't found a Letter from you, ${userName}.`);
            } else {
                this.letterBag.modifyLetterFrom(userName, message.substring('ps'.length).trim());
                this.say(channelID, `Got it, ${userName}`);
            }
        } else if (message.startsWith('get me my letter')) {
            let letter = this.letterBag.getLetterFrom(userName);
            if (letter == null) {
                this.say(channelID, `I have no Letter for you this time, ${userName}`);
            } else {
                this.say(channelID, 'I have found your letter\n```' + letter + '```');
                this.letterBag.removeLetterFrom(userName);
            }
        };
    }

    private say(channelID: string, what: string) {
        this.discordClient.sendMessage({
            to: channelID,
            message: what
        });
    }

    private greet(channelID: string, userName: string) {
        this.say(channelID,
            'Hello '  + userName + '\n' +
            'I am your friendly mail mare!' + '\n' +
            'You can let me **say** <something>' + '\n' +
            'or let me **take a letter** <your letter>,' + '\n' +
            'but if you want to add something to it just use **ps** <something>,' +'\n' +
            'and just to be sure to get your letter afterwards. ' + '\n' +
            '**get me my letter** (I will no longer have it then.)');
    }

}