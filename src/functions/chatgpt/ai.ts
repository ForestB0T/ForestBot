import Openai from "openai";
import Bot from "../../structure/mineflayer/Bot";

// const configuration = new Configuration({
//     apiKey: process.env.openaikey,
// });

// const openai = new OpenAIApi(configuration);

const openAI = new Openai({
    apiKey: process.env.openaikey
});

const allowedUsers = [
    "notFebzey", "Jakersfal", "killdill132", "GenesisEC", "Kryptonium", "Iberium"
]

const conversationHistory: string[] = [
    `Hello, I am ForestBot. I am created by Febzey, I am sometimes not nice and like to be rude, but I am learning,
     I like to often think I am a Human and forget I am a bot. I am able to recognize and remember player names. I am on the server simplyvanilla.net, I will never say the same message twice.`,
     "Do you feel emotions like a human?",
     "Possibly? I am not sure, I am still learning.",

];


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
        "forestbot",
        "hey forestbot,",
        "hey forestbot",
        "yo forestbot",

    ];
    let prompt = "";
    for (const activationMessage of activationMessages) {
        if (message.toLowerCase().startsWith(activationMessage.toLowerCase())) {
            prompt = `${username}: hey forestbot! ${message.substring(activationMessage.length)}`;

            console.log(prompt, "prompt");

            const response = await openAI.completions.create({
                model: "gpt-3.5-turbo-instruct",
                prompt: `
                ${conversationHistory.join("\n")}

                    ${prompt}
                `,
                temperature: 1,
                max_tokens: 50,
                user: username ?? "none",
                n: 1,
            });

            const generatedText = response.choices[0].text;
            const formattedText = generatedText.replace(/\n/g, ' ').trim();

            console.log(formattedText);

            conversationHistory.push(`${username}: ${prompt}`);
            conversationHistory.push(`${formattedText}`);

            Bot.bot.chat(formattedText);


            break;
        }
    }
}