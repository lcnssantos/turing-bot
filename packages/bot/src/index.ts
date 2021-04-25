import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";
import { CognitiveService } from "./client";
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN || "");
const cognitiveApi = new CognitiveService(process.env.COGNITIVE_API || "");

bot.start((ctx) => {
  ctx.reply(
    "Olá! Tudo bem? Eu sou o Turing bot e posso te responder perguntas sobre qualquer assunto sobre programação"
  );
});

bot.on("text", async (ctx) => {
  try {
    ctx.replyWithChatAction("typing");
    const msg = ctx.message.text;
    const result = await cognitiveApi.fetch(msg);

    await ctx.reply(result.text.join("\n\n\n"));
    await ctx.reply(`Eu encontrei esse conteúdo neste link ${result.link}`);

    await ctx.replyWithHTML(
      `Você também pode aprofundar seus estudos pesquisando por ${result.suggestions
        .map((suggestion: string) => `<b>${suggestion}</b>`)
        .join(" e ")} `
    );

    if (result.links.length) {
      if (result.links.length > 1) {
        await ctx.reply("Esses links também podem te ajudar");
      } else {
        await ctx.reply("Esse link também pode te ajudar");
      }
      await Promise.all(result.links.map((link: string) => ctx.reply(link)));
    }
  } catch (e) {
    await ctx.reply("Infelizmente um erro aconteceu, tente mais tarde");
  }
});

bot.launch();
