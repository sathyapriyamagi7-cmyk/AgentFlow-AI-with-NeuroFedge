
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AgentMode, ChatMessage } from "../types";
import { AGENT_CONFIGS, NEURO_FEDGE_PROMPT } from "../constants";

const getAIInstance = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
};

export const runAgentTask = async (mode: AgentMode, input: string): Promise<string> => {
  const ai = getAIInstance();
  const config = AGENT_CONFIGS[mode];
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: input,
      config: {
        systemInstruction: config.systemPrompt,
        temperature: 0.2, // Lower temp for consistency in technical tasks
      },
    });
    
    return response.text || "No response received from agent.";
  } catch (error) {
    console.error(`Error running ${mode}:`, error);
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
};

export const runSupervisorWorkflow = async (input: string): Promise<{ output: string, confidence: number }> => {
  const ai = getAIInstance();
  
  // In a real multi-agent flow, we might chain multiple calls. 
  // For the MVP, we simulate the internal verification.
  const prompt = `Perform a multi-step analysis:
  1. Review the input logic.
  2. Identify potential performance or security risks.
  3. Synthesize the final corrected version.
  4. Provide a confidence score.
  
  Input: ${input}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: AGENT_CONFIGS[AgentMode.SUPERVISOR].systemPrompt,
        temperature: 0.1,
      },
    });

    const text = response.text || "";
    // Mocking confidence extraction - in production we'd use responseSchema or structured JSON
    const confidenceMatch = text.match(/Confidence:\s*(\d+)/i);
    const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 95;

    return { output: text, confidence };
  } catch (error) {
    throw error;
  }
};

export const neuroFedgeChat = async (messages: ChatMessage[]): Promise<string> => {
  const ai = getAIInstance();
  const history = messages.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }]
  }));

  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview", // Use flash for chat speed
      config: {
        systemInstruction: NEURO_FEDGE_PROMPT,
      }
    });

    // Just send the latest message for the API call if history management is complex
    const lastUserMsg = messages[messages.length - 1].content;
    const response = await chat.sendMessage({ message: lastUserMsg });
    
    return response.text || "NeuroFedge is contemplating...";
  } catch (error) {
    console.error("NeuroFedge Error:", error);
    return "I'm having trouble connecting to my cognitive core right now.";
  }
};
