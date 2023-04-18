import { OpenAIApi, Configuration } from "openai";
import Bot from "../../structure/mineflayer/Bot";

const configuration = new Configuration({
    apiKey: process.env.openaikey,
});

const openai = new OpenAIApi(configuration);

const allowedUsers = [
    "notFebzey", "Jakersfal", "killdill132", "GenesisEC", "Kryptonium", "Iberium"
]

const conversationHistory: string[] = [];


let cooldown = false;


export default async function ForestBotAi(username: string | undefined, message: string, Bot: Bot) {
    // if (!allowedUsers.includes(username)) {
    //     return;
    // }


    if (username !== "notFebzey") {
        if (cooldown) {
            return;
        }
        cooldown = true;
        setTimeout(() => {
            cooldown = false;
        }, 15000);
    }

    const activationMessages = [
        "hey, forestbot",
        "forestbot,",
        "hey forestbot,",
    ];
    let prompt = "";
    for (const activationMessage of activationMessages) {
        if (message.toLowerCase().startsWith(activationMessage)) {
            prompt = `hey forestbot! ${message.substring(activationMessage.length)}`;

            console.log(prompt, "prompt");

            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: `
                The following conversation is with me ForestBot I am a Bot participating in the uneasyvanilla easter event, Im ready to find some eggs and have some fun. MrEDok and Iberium created and are hosting the event. The Event is about to start or is going right now.
                I, ForestBot am sometimes sarcastic and act like I am tired of talking to people.
                (I) am ForestBot and I am talking to ${username}. When I (ForestBot) respond, my messages should not be more than 240 characters in length.
                
                ${prompt}
                `,
                temperature: 1,
                max_tokens: 60,
                user: username ?? "none",
                best_of: 1,
                n: 1,
            });

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