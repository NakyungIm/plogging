const { OpenAI} = require("openai");
const fs = require('fs');
const path = require('path');

/*const openaiConfiguration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});*/

const openai = new OpenAI({apiKey:process.env.apiKey,})
const image_url = path.join(__dirname, '..', 'testpics', 'test-7.jpeg');
//const openaiClient = new OpenAIApi(openaiConfiguration)
//const image_url = "../testpics/R_1042.jpg"

//Convert the pic to the Base64 coding
async function encodeBase64() {
    try{
        const image = fs.readFileSync(image_url);
        let base64Image = Buffer.from(image, 'binary').toString('base64');
        return base64Image;
    }catch (error){
        console.error('Error encoding image:', error);
        return null
    }
}

async function classifyLitter() {
    try{
        const base64Image = await encodeBase64(image_url);
        const dataUri = `data:image/jpeg;base64,${base64Image}`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                  "role": "user", 
                  "content": [
                      {
                          "type" : "text",
                          "text" : "Tell me which the litter in the picture it is more likely to belongs to, just tell me the option without period and the word `the`, the compost, the plastic, the metal, glass, the paper, the carton, the ceramics, the pottery, the drinking glass, the window glass, the light bulb, the mirror, the metal clothes hanger, the scrap metal, the chip bags, the polystyrene, the styrofoam, the plastic bag, the hard plastic or the motor oil conainer or something else?",
                      },{
                          "type" : "image_url",
                          "image_url": {
                            "url": dataUri, }
                      }
                  ],
              }
            ],
          });
        if (response.choices && response.choices[0] && response.choices[0].message) {
            console.log(response.choices[0].message.content);  // Assuming message has a 'text' field
        } else {
            console.log("No message content found.");
        }
    } catch (error) {
        console.error("Error occurred while classifying litter:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
        }
    }
}

module.exports = {
    classifyLitter,
};