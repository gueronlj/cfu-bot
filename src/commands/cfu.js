const  axios  = require('axios');
const { openAI_key, openAI_url }  = require('../../config.json');
const { SlashCommandBuilder } = require('discord.js');

let userMessage = 'What are you?';
let AI_response = '';


const sendCompletion = async () => {
    try{
        const response = await axios.post(
            `${openAI_url}`,
            {
                "model": "gpt-3.5-turbo",
                "messages": [
                    {
                        "role": "user",
                        "content":  `${userMessage}`
                    }
                ],
                "temperature": 0.7
            },{
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${openAI_key}`
                }
            }
        );
        AI_response = response.data.choices[0].message.content;
        console.log( AI_response );
    }catch( error ){
        console.log( error );
    }
};

sendCompletion();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cfu')
		.setDescription('Seek wisdom from Sifu'),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
        sendCompletion();
		await interaction.reply(AI_response);
	},
};