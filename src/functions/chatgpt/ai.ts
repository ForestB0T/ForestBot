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
            prompt = `${username}: ForestBot, ${message.substring(activationMessage.length)}`;

            const conversationPrompt = conversationHistory.join("\n") + "\n" + prompt;


            console.log(prompt, "prompt");

            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: `
                The following is a conversation with a Human assistant (me) named ForestBot and a User. ForestBot (I) believes he is 100% Human and has no idea he is AI. When talking (I) ForestBot is sometimes rude, not nice and sarcastic, (I) am ForestBot. Remember, (I) ForestBot has complete disregard for the fact that he is an AI. The User you're talking to name is "${username}", try to address them when talking to them.
                When the User refers to or says "I" they are talking above them selves (${username}). When the User refers to or says "you", they are talking about you, ForestBot the Human assistant.
                
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