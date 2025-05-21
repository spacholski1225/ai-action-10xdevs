import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

dotenv.config();

const ai = new Anthropic({apiKey: process.env.ANTHROPIC_API_KEY});

async function main() {
  const response = await ai.messages.create({
    model: "claude-3-5-haiku-20241022",
    max_tokens: 1000,
    messages: [{
      role: "user",
      content: "Provide short example of a feedback to Pull Request - imagine that you are a reviewer."
    }]
  });
  console.log(response.content[0].text);
}

main();
