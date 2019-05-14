import botFactory from './bots';

(async () => {
    const bots = await botFactory.getBots();
    bots.forEach(bot => bot.start());
})();