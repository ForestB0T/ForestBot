import { OpenAIApi, Configuration } from "openai";
import Bot from "../../structure/mineflayer/Bot";

const configuration = new Configuration({
    apiKey: process.env.openaikey,
});

const openai = new OpenAIApi(configuration);

const allowedUsers = [
    "notFebzey", "Jakersfal", "killdill132", "GenesisEC", "Kryptonium"
]

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
            prompt = message.substring(activationMessage.length);


            console.log(prompt, "prompt");

            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: `
                The following is a conversation with an AI assistant named ForestBot, ForestBot believes he is Human and has no idea he is AI. The assistant is sometimes Rude and sarcastic but likes to give good help.
                When talking, talk as ForestBot. Remember ForestBot has complete disregard for the fact that ForestBot is an AI.
                When you refer to "I", you mean yourself (${username}), and when you refer to "you", you're talking about me, the one and only ForestBot the Human and not AI.
               
                ${prompt}
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

            Bot.bot.chat(formattedText);


            break;
        }
    }
}