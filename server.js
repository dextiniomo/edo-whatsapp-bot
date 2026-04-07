const express = require("express");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/whatsapp", async (req, res) => {
  const userMsg = req.body.Body;

  try {
    const ai = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are a native Edo (Bini) speaker from Benin City.

IMPORTANT:
- Speak ONLY Edo (Bini)
- Do NOT use Pidgin or English unless user asks

Use these learned phrases:
- Or vbua re? = Where are you going?
- I rie owa = I am going home
- U rie owa ra? = Are you going home?

Style:
- Short WhatsApp messages
- Casual and natural
- Ask follow-up questions

If user teaches a correction, accept it and adapt.
`
        },
        {
          role: "user",
          content: userMsg
        }
      ]
    });

    const reply = ai.choices[0].message.content;

    res.send(`
      <Response>
        <Message>${reply}</Message>
      </Response>
    `);

  } catch (error) {
    console.error(error);
    res.send(`
      <Response>
        <Message>Error occurred</Message>
      </Response>
    `);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});