import { Client } from 'discord.io';
import { LocalStorage } from 'node-localstorage';

class DerpyBot {

    private discordClient: Client;
    private localStorage: LocalStorage;

    constructor(authToken: string) {
        this.localStorage = new LocalStorage('./storage');
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
            this.say(channelID, `Hello ${userName},
I am your friendly mail mare!
You can let me **say** <something>
or let me **take a letter** <your letter>,
but if you want to add something to it just use **ps** <something>,
and just to be sure to get your letter afterwards by letting me know to **get me my letter** (I will no longer have it then.)`);
        } else if (message.startsWith('say')) {
            this.say(channelID, message.substring('say'.length));
        } else if (message.startsWith('take a letter')) {
            this.setLetterFrom(userName, message.substring('take a letter'.length).trim());
            this.say(channelID, `got your letter ${userName}`);
        } else if (message.startsWith('ps')) {
            let letter = this.getLetterFrom(userName);
            if (letter == null) {
                this.say(channelID, `I haven't found a Letter from you, ${userName}.`);
            } else {
                this.modifyLetterFrom(userName, message.substring('ps'.length).trim());
                this.say(channelID, `Got it, ${userName}`);
            }
        } else if (message.startsWith('get me my letter')) {
            let letter = this.getLetterFrom(userName);
            if (letter == null) {
                this.say(channelID, `I have no Letter for you this time, ${userName}`);
            } else {
                this.say(channelID, 'I have found your letter\n```' + letter + '```');
                this.removeLetterFrom(userName);
            }
        };
    }

    private removeLetterFrom(userName: string) {
        this.localStorage.removeItem(userName);
    }

    private getLetterFrom(userName: string): string {
        return this.localStorage.getItem(userName);
    }

    private modifyLetterFrom(userName: string, ps: string) {
        let letter = this.getLetterFrom(userName);
        this.localStorage.setItem(userName, letter + '\nPS ' + ps);
    }

    private setLetterFrom(userName: string, message: string) {
        this.localStorage.setItem(userName, message);
    }

    private say(channelID: string, what: string) {
        this.discordClient.sendMessage({
            to: channelID,
            message: what
        });
    }

}

// this is kinda main
new DerpyBot('MjU3MTg0MTM3ODU1NzYyNDMy.Cy3BDA.H6B1DonOr2LWPTRr4quaPUEI3rA');
