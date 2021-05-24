import { HttpServer, Injectable, Logger } from '@nestjs/common';
import { CognitiveService } from 'src/cognitive/services/cognitive.service';
import { BotInterface } from './bot.interface';
import { BotTelegram } from './telegram/bot.telegram';

@Injectable()
export class BotService {
  private connectors: BotInterface[];
  private logger = new Logger(BotService.name);

  constructor(
    private cognitiveService: CognitiveService,
    telegramConnector: BotTelegram,
  ) {
    this.connectors = [telegramConnector];
  }

  async start(server: HttpServer) {
    await Promise.all(
      this.connectors.map(async (connector) => {
        await connector.configure(server);
        connector.registerMessageListener(this.receiveMessage.bind(this));
      }),
    );

    this.logger.log(
      JSON.stringify({
        type: 'bot.connectors.configured',
        data: { quantity: this.connectors.length },
      }),
    );
  }

  async receiveMessage(text: string, chatId: string, connector: BotInterface) {
    try {
      this.logger.log(
        JSON.stringify({
          type: 'bot.message.received',
          data: text,
        }),
      );

      await connector.startTyping(chatId);

      const result = await this.cognitiveService.fetch(text);

      await connector.sendText(result.text.join('\n\n\n'), chatId);

      await connector.sendText(
        `Eu encontrei esse conteúdo neste link ${result.link}`,
        chatId,
      );

      await connector.sendHtml(
        `Você também pode aprofundar seus estudos pesquisando por ${result.suggestions
          .map((suggestion: string) => `<b>${suggestion}</b>`)
          .join(' e ')} `,
        chatId,
      );

      this.logger.log(
        JSON.stringify({
          type: 'bot.suggestions.sended',
          data: result.suggestions,
        }),
      );

      if (result.links.length) {
        if (result.links.length > 1) {
          await connector.sendText(
            'Esses links também podem te ajudar',
            chatId,
          );
        } else {
          await connector.sendText('Esse link também pode te ajudar', chatId);
        }
        await Promise.all(
          result.links.map((link: string) => connector.sendText(link, chatId)),
        );
      }
    } catch (e) {
      this.logger.error({
        type: 'bot.interaction.error',
        data: e,
      });

      switch (e.message) {
        case 'NOTFOUND':
          connector.sendText(
            'A vida é um aprendizado constante!. No momento não sei te responder essa pergunta. Mas estou estudando o máximo que posso para poder te ajudar!',
            chatId,
          );
          break;
        default:
          connector.sendText(
            'Infelizmente um erro aconteceu, tente mais tarde',
            chatId,
          );
          break;
      }
    }
  }
}
