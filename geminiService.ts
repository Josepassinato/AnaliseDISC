
import { GoogleGenAI, Type } from "@google/genai";
import { AssessmentResult, AIAnalysis, ProfileType } from "./types";

export const generateBehavioralAnalysis = async (result: AssessmentResult): Promise<AIAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analise o seguinte perfil comportamental DISC para um contexto de igreja cristã (EMB Church):
    Perfil Primário: ${result.primary}
    Perfil Secundário: ${result.secondary || 'Nenhum'}
    Scores: D:${result.scores[ProfileType.DOMINANCE]}, I:${result.scores[ProfileType.INFLUENCE]}, S:${result.scores[ProfileType.STABILITY]}, C:${result.scores[ProfileType.COMPLIANCE]}.
    
    Identifique EXATAMENTE os 3 ministérios com maior afinidade para este perfil entre as opções abaixo:
    - Ministério Infantil, Louvor, Ensino, Recepção, Consolidação, Audiovisual, Estacionamento, Logística, Diaconato, Intercessão e Oração, Aconselhamento de Casais.
    
    O seu retorno deve priorizar o TOP 3, sendo:
    1. O mais assertivo pelo perfil.
    2. O segundo mais assertivo.
    3. O terceiro mais assertivo.

    IMPORTANTE: No campo 'summary', você DEVE obrigatoriamente citar a 'EMB Church' e explicar como o perfil do usuário se conecta com a visão e o corpo desta igreja específica.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      systemInstruction: `Você é um consultor ministerial e especialista DISC da EMB Church. Forneça um relatório detalhado focado em crescimento pessoal e serviço na igreja.
      O relatório deve ter uma linguagem encorajadora e profunda.
      No resumo estratégico, conecte sempre as características do usuário ao propósito da EMB Church.
      Retorne SEMPRE um JSON válido com exatamente 3 itens no campo ministryFit, ordenados do 1º ao 3º lugar.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          communicationStyle: { type: Type.STRING },
          leadershipStyle: { type: Type.STRING },
          idealEnvironment: { type: Type.STRING },
          careerTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          ministryFit: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                percentage: { type: Type.NUMBER },
                reason: { type: Type.STRING }
              },
              required: ["name", "percentage", "reason"]
            }
          }
        },
        required: ["summary", "strengths", "weaknesses", "communicationStyle", "leadershipStyle", "idealEnvironment", "careerTips", "ministryFit"]
      }
    }
  });

  try {
    const jsonStr = response.text || "{}";
    return JSON.parse(jsonStr) as AIAnalysis;
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    throw new Error("Erro ao gerar análise comportamental ministerial.");
  }
};

export const generateProfileImage = async (primary: ProfileType, secondary: ProfileType | null): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Minimalist professional illustration representing the behavioral profile ${primary} ${secondary ? 'mixed with ' + secondary : ''}. Symbolic, abstract, sophisticated church-friendly aesthetic. High contrast, clean design.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "1:1" } },
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
};
