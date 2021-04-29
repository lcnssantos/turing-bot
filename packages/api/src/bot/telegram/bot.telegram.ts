import { BotInterface, MessageListener } from '../bot.interface';
import { Telegraf } from 'telegraf'
import { HttpServer, Logger } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core';

export class BotTelegram implements BotInterface {

  private bot: Telegraf;
  private logger = new Logger(BotTelegram.name);
  private listeners: MessageListener[] = [];

  constructor() {
    this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)
  }

  async sendHtml(html: string, chatId: string) {
    await this.bot.telegram.sendMessage(chatId, html, {parse_mode: 'HTML'});
  }

  async startTyping(chatId: string) {
    await this.bot.telegram.sendChatAction(chatId, "typing");
  }

  registerMessageListener(listener: MessageListener) {
    this.listeners.push(listener);
  }

  async sendText(text: string, chatId: string) {
    await this.bot.telegram.sendMessage(chatId, text);
  }

  async configure( server: HttpServer) {
    this.logger.log("Start configure")

    this.bot.start((ctx) => {
      const name = ctx.from.first_name;

      ctx.reply(
        `Olá ${name}! Tudo bem? Eu sou o Turing bot e posso te responder perguntas sobre qualquer assunto sobre programação`
      );
    });

    this.bot.on("text", ctx => {
      this.listeners.forEach(listener => listener(ctx.message.text, ctx.message.chat.id.toString(), this));
    })

    if(process.env.ENV === "PROD") {
      this.logger.log("Setting webhook!")
      
      await this.bot.telegram.setWebhook(`${process.env.URL}/telegram-webhook`)
      server.use(this.bot.webhookCallback('telegram-webhook'))

    }

    await this.bot.launch();

    this.logger.log("Bot running");
  }
}