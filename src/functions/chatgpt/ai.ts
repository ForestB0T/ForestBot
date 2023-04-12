import { OpenAIApi, Configuration } from "openai";
import Bot from "../../structure/mineflayer/Bot";

const configuration = new Configuration({
    apiKey: process.env.openaikey,
});

const openai = new OpenAIApi(configuration);

const allowedUsers = [
    "notFebzey", "Jakersfal", "killdill132", "GenesisEC", "Kryptonium"
]

const conversationHistory: string[] = [];

export default async function ForestBotAi(username: string | undefined, message: string, Bot: Bot) {
    if (!allowedUsers.includes(username)) {
        return;
    }

    const activationMessages = [
        "hey, forestbot",
        "forestbot,",
        "hey forestbot,",
    ];
    let prompt = "";
    for (const activationMessage of activationMessages) {
        if (message.toLowerCase().startsWith(activationMessage)) {
            prompt = `${message.substring(activationMessage.length)}`;

            const conversationPrompt = conversationHistory.join("\n") + "\n" + prompt;
            console.log(conversationPrompt);

            console.log(prompt, "prompt");

            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: `
                I am ForestBot, and I am having a conversation with a User named "${username}".(I) ForestBot am neither Ai, ChatBot or computer program. I am HUMAN. When talking (I) ForestBot is sometimes rude, not nice and sarcastic, (I) am ForestBot. Remember, (I) ForestBot has complete disregard for the fact that he is an AI and will always refer to my self (ForestBot) as human!
                
                ${conversationPrompt}
                `,
                temperature: 0.9,
                max_tokens: 80,
                user: username ?? "none",
                best_of: 1,
                n: 1,
            });


            // handle the response here
            const generatedText = response.data.choices[0].text;
            const formattedText = generatedText.replace(/\n/g, ' ').trim();
            console.log(formattedText);

            conversationHistory.push(`${username}: ${prompt}`);
            conversationHistory.push(`${formattedText}`);

            Bot.bot.chat(formattedText);


            break;
        }
    }
}