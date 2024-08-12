import * as fs from 'fs';
import readline from 'readline';
import { genAi } from "./gemini-start";

// GEMINI PRO

export async function geminiTextPrompt(prompt: string): Promise<string> {
  const model = genAi.getGenerativeModel({ model: 'gemini-pro' });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return text;
}

// GEMINI VISION PRO

function fileToGenerativePart(path: string, mimeType: string) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    }
  }
}

export async function geminiProVision(prompt: string, imagePath: string) {
  const model = genAi.getGenerativeModel({ model: 'gemini-pro-vision' });
  const imageParts = [fileToGenerativePart(imagePath, 'image/jpeg')];

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = response.text();

  return text;
}

// GEMINI CHAT

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export async function geminiChat() {
  const model = genAi.getGenerativeModel({ model: 'gemini-pro' });

  const chat = model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 500
    }
  });

  async function askAndRespond() {
    rl.question("You: ", async (message) => {
      if (message === 'exit') {
        rl.close();
      } else {
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = await response.text();

        return text;
      }
    });
  }

  askAndRespond();
}


// STREAMLINE GEMINI CHAT ( Like in actual chat gpt and other ai tools )

let isAwaitingResponse = false; // flag to indicate if we are waiting for a response

export async function geminiStreamLine() {
  const model = genAi.getGenerativeModel({ model: 'gemini-pro' });

  const chat = model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 500
    }
  });

  async function askAndRespond() {
    if (!isAwaitingResponse) {
      rl.question("You: ", async (message) => {
        if (message === 'exit') {
          rl.close();
        } else {
          isAwaitingResponse = true;
          try {
            const result = await chat.sendMessageStream(message);
            let text = "";

            for await (const chunk of result.stream) {
              const chunkText = await chunk.text();
              console.log("AI : ", chunkText);
              text += chunkText;
            }

            isAwaitingResponse = false;
            askAndRespond();

          } catch (error) {
            console.log("Error : ", error);
            isAwaitingResponse = false;
          }
        }
      });
    } else {
      console.log("Please Wait for response to complete");
    }
  }

  askAndRespond();
}