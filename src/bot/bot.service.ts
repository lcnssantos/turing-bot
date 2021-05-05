import { HttpServer, Injectable } from '@nestjs/common';
import { CognitiveService } from 'src/cognitive/services/cognitive.service';
import { BotInterface } from './bot.interface';
import { BotTelegram } from './telegram/bot.telegram';

@Injectable()
export class BotService {
  private connectors: BotInterface[];

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
  }

  async receiveMessage(text: string, chatId: string, connector: BotInterface) {
    try {
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

          connector.sendText(JSON.stringify(e), chatId);
          break;
      }
    }
  }
}
