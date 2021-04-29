export type MessageListener = (
  message: string,
  chatId: string,
  connector: BotInterface,
) => Promise<void>;

export interface BotInterface {
  registerMessageListener(listener: MessageListener): void;
  sendText(text: string, chatId: string): Promise<void>;
  sendHtml(html: string, chatId: string): Promise<void>;
  configure(): Promise<void>;
  startTyping(chatId: string): Promise<void>;
}
