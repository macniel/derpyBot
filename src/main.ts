import { Client } from 'discord.io';
import { LocalStorage } from 'node-localstorage';

// let LocalStorage = require('node-localstorage').LocalStorage;

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
        this.initClient();
    }

    private parseCommand(userName: string, channelID: string, message: string) {
        if (message.startsWith('help') || message.trim() == '') {
            this.discordClient.sendMessage({
                to: channelID,
                message: `Hello ${userName},
I am your friendly mail mare!
You can let me **say** <something>
or let me **take a letter** <your letter>,
but if you want to add something to it just use **ps** <something>,
and just to be sure to get your letter afterwards by letting me know to **get me my letter** (I will no longer have it then.)`
            });
        } else if (message.startsWith('say')) {
            this.discordClient.sendMessage({ to: channelID, message: message.substring(4) });
        } else if (message.startsWith('take a letter')) {
            this.localStorage.setItem(userName, message.substring('take a letter'.length).trim());
            this.discordClient.sendMessage({
                to: channelID,
                message: `got your letter ${userName}`
            });
        } else if (message.startsWith('ps')) {
            let letter = this.localStorage.getItem(userName);
            if (letter == null) {
                this.discordClient.sendMessage({
                    to: channelID,
                    message: `There isnt a letter yet, ${userName}.`
                });
            } else {
                this.localStorage.setItem(userName, letter + '\nPS ' + message.substring('ps'.length).trim());
                this.discordClient.sendMessage({
                    to: channelID,
                    message: `got it, ${userName}`
                });
            }
        } else if (message.startsWith('get me my letter')) {
            let letter = this.localStorage.getItem(userName);
            if (letter == null) {
                this.discordClient.sendMessage({
                    to: channelID,
                    message: `There is no Letter for you this time ${userName}`
                });
            } else {
                this.discordClient.sendMessage({
                    to: channelID,
                    message: 'here is the letter\n```' + letter + '```'
                });
                this.localStorage.removeItem(userName);
            }
        };
    }

    private initClient() {

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
}

// this is kinda main
new DerpyBot('MjU3MTg0MTM3ODU1NzYyNDMy.Cy3BDA.H6B1DonOr2LWPTRr4quaPUEI3rA');
