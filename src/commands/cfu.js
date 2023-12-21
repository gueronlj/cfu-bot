const  axios  = require('axios');
const { openAI_key, openAI_url }  = require('../../config.json');
const { SlashCommandBuilder } = require('discord.js');

let AI_response = '';
let axiosError = null

const sendCompletion = async (message) => {
    try{
        const response = await axios.post(
            `${openAI_url}`,
            {
                "model": "gpt-3.5-turbo",
                "messages": [
                    {
                        "role": "user",
                        "content":  `${message}`
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
    }catch( error ){
        axiosError = error.message;
    }
};

//sendCompletion();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cfu')
		.setDescription('Seek wisdom from Sifu')
        .addStringOption(option =>
			option
				.setName('input')
				.setDescription('The wisdom you seek')),
	async execute(interaction) {     
        const input = interaction.options.getString('input');
        await interaction.deferReply({ ephemeral: true });
        await sendCompletion(input);
		await interaction.editReply(AI_response || axiosError);
	},  
};