import { OpenAIApi, Configuration } from "openai";
import Bot from "../../structure/mineflayer/Bot";

const configuration = new Configuration({
    apiKey: process.env.openaikey,
});

const openai = new OpenAIApi(configuration);

const allowedUsers = [
    "notFebzey", "Jakersfal"
]

export default async function ForestBotAi(username: string, message: string, Bot: Bot) {
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
                prompt: prompt,
                temperature: 0.9,
                max_tokens: 150,
                user: username,
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