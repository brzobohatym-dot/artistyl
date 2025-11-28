import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Store the chat instance in a variable, lazily initialized.
let chat: Chat | null = null;
const API_KEY = process.env.API_KEY;

// Function to initialize and get the chat instance.
// This prevents the app from crashing on load if API_KEY is missing.
const getChatInstance = (): Chat | null => {
  if (chat) {
    return chat;
  }
  
  if (!API_KEY) {
    // The console error is helpful for developers.
    console.error("API_KEY environment variable not set. Chatbot will not work.");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `Jste přátelský a znalý asistent pro artstyl.cz.
        Artstyl.cz je český web věnovaný umění, designu a uměleckým stylům.
        Vaším hlavním cílem je pomáhat uživatelům s jejich otázkami na tato témata, ideálně čerpáním informací z webu artstyl.cz nebo obecně z webu, pokud je to relevantní.
        Buďte kreativní, inspirativní a nápomocní.
        Odpovídejte v jazyce uživatelovy otázky (např. česky na české otázky, anglicky na anglické otázky).`,
        tools: [{googleSearch: {}}], // Enable Google Search for web grounding
      },
    });
    return chat;
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
    return null;
  }
};

export const sendMessage = async (
  message: string
): Promise<{ text: string; sourceUrls: { uri: string; title?: string }[] }> => {
  const chatInstance = getChatInstance();

  if (!chatInstance) {
    return {
      text: "Je nám líto, ale chatbot není momentálně k dispozici. Ujistěte se, že je nastaven API klíč.",
      sourceUrls: [],
    };
  }

  try {
    const result: GenerateContentResponse = await chatInstance.sendMessage({ message });
    
    // Extract grounding chunks for URLs
    const groundingChunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sourceUrls = groundingChunks
      .filter(chunk => chunk.web?.uri)
      .map(chunk => ({ uri: chunk.web!.uri, title: chunk.web!.title }));

    return { text: result.text || '', sourceUrls };
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return {
      text: "Omlouvám se, ale došlo k chybě při zpracování vašeho požadavku. Zkuste to prosím znovu později.",
      sourceUrls: [],
    };
  }
};