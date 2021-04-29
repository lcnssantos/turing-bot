import { HttpServer } from "@nestjs/common";

export type MessageListener = (
  message: string,
  chatId: string,
  connector: BotInterface,
) => Promise<void>;

export interface BotInterface {
  registerMessageListener(listener: MessageListener): void;
  sendText(text: string, chatId: string): Promise<void>;
  sendHtml(html: string, chatId: string): Promise<void>;
  configure( server: HttpServer): Promise<void>;
  startTyping(chatId: string): Promise<void>;
}
