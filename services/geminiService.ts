import { GoogleGenAI, Modality, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Generates a creative idea and an image prompt from a brief.
 * @param brief The creative brief.
 * @returns An object containing the generated idea and image prompt.
 */
export const generateIdeaAndPrompt = async (brief: string): Promise<{ idea: string; prompt: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Basado en el siguiente brief: "${brief}", genera una idea conceptual para un post de Instagram y un prompt descriptivo y detallado para un generador de imágenes de IA. El prompt debe ser visualmente rico. Devuelve un objeto JSON con las claves "idea" y "prompt".`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            idea: { type: Type.STRING, description: 'La idea conceptual para el post.' },
            prompt: { type: Type.STRING, description: 'El prompt detallado para el generador de imágenes.' },
          },
          required: ['idea', 'prompt'],
        },
      },
    });
    const jsonString = response.text.trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error generating idea and prompt:', error);
    return { idea: 'Error al generar idea.', prompt: 'Error al generar prompt.' };
  }
};

/**
 * Generates an image using gemini-2.5-flash-image model.
 * @param prompt The text prompt for the image.
 * @returns A base64 encoded image string.
 */
export const generateImage = async (prompt: string): Promise<string | null> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (error) {
        console.error('Error generating image:', error);
        return null;
    }
};


/**
 * Generates social media copy from an idea with a specific tone.
 * @param idea The creative idea for the post.
 * @param tone The desired tone ('Más Amigable' or 'Más Técnico').
 * @returns The generated copy as a string.
 */
export const generateCopyFromIdea = async (idea: string, tone: 'Más Amigable' | 'Más Técnico'): Promise<string> => {
  const toneInstruction = tone === 'Más Amigable'
    ? 'Usa un tono cercano, amigable y empático. Utiliza emojis para conectar con la audiencia.'
    : 'Usa un tono más formal, informativo y profesional. Prioriza la claridad y los datos.';

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Eres un copywriter experto para Instagram. Basado en la siguiente idea: "${idea}", escribe un copy para el post. ${toneInstruction} Incluye hashtags relevantes al final.`,
    });
    return response.text;
  } catch (error) {
    console.error('Error generating copy:', error);
    return 'Error al generar el copy.';
  }
};
