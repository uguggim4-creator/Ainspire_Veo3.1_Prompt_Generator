import { GoogleGenAI, Type } from "@google/genai";
import type { Language, ModelName, VeoPrompt } from '../types';
import { translations } from "../i18n";

let ai: GoogleGenAI | null = null;

export const initializeAi = (apiKey: string) => {
  ai = new GoogleGenAI({ apiKey });
};

export const deinitializeAi = () => {
  ai = null;
};


const PROMPT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    scene_settings: {
      type: Type.OBJECT,
      properties: {
        overall_situation: { type: Type.STRING, description: "A brief, evocative summary of the entire scene's context and action." },
        background_details: {
          type: Type.OBJECT,
          properties: {
            location: { type: Type.STRING, description: "The specific location of the scene, e.g., 'A bioluminescent forest at midnight'." },
            elements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key inanimate objects or environmental features in the background." }
          },
          required: ["location", "elements"]
        },
        video_style: {
          type: Type.OBJECT,
          properties: {
            genre: { type: Type.STRING, description: "The cinematic genre or style, e.g., 'Sci-Fi Noir', 'Cyberpunk', 'Cartoon Style'." },
            look_and_feel: { type: Type.STRING, description: "The overall aesthetic and mood, e.g., 'Dreamy and surreal with high contrast'." },
            color_palette: { type: Type.STRING, description: "The dominant colors of the scene, e.g., 'Neon pinks, electric blues, and deep purples'." },
            lighting: { type: Type.STRING, description: "Description of the scene's lighting, e.g., 'Soft, diffused morning light streaming through a window'." }
          },
          required: ["genre", "look_and_feel", "color_palette", "lighting"]
        }
      },
      required: ["overall_situation", "background_details", "video_style"]
    },
    characters: {
      type: Type.ARRAY,
      description: "A list of characters present in the scene.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "The character's name or identifier, e.g., 'hero', 'villain', 'robot_sidekick'." },
          appearance_and_action: {
            type: Type.OBJECT,
            properties: {
              appearance: { type: Type.STRING, description: "Detailed description of the character's physical appearance and clothing." },
              action: { type: Type.STRING, description: "What the character is actively doing in the scene." }
            },
            required: ["appearance", "action"]
          }
        },
        required: ["name", "appearance_and_action"]
      }
    },
    camera_movement: {
      type: Type.OBJECT,
      properties: {
        type: { type: Type.STRING, description: "The type of camera shot, e.g., 'Dolly Zoom', 'Tracking Shot', 'Dutch Angle'." },
        description: { type: Type.STRING, description: "A detailed description of the camera's movement and focus." }
      },
      required: ["type", "description"]
    },
    audio: {
      type: Type.OBJECT,
      properties: {
        music: { type: Type.STRING, description: "Description of the background music or score." },
        sfx: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of key sound effects." },
        dialogue: {
          type: Type.OBJECT,
          description: "Spoken lines in the scene. Can be empty if no dialogue.",
          properties: {
            speaker: { type: Type.STRING, description: "The name of the character who is speaking (must match a name from the characters list)." },
            line: { type: Type.STRING, description: "The dialogue line." }
          },
        }
      },
      required: ["music", "sfx"]
    }
  },
  required: ["scene_settings", "characters", "camera_movement", "audio"]
};


const getPromptGenerationInstructions = (lang: Language) => {
    const t = translations[lang];
    if (lang === 'ko') {
        return {
            main: `당신은 창의적인 비디오 감독입니다. 사용자가 비디오 장면에 대한 컨셉을 제공할 것입니다. 당신의 임무는 이 컨셉을 VEO를 위한 상세하고 구조화된 JSON 프롬프트 객체로 변환하는 것입니다.
                   장면 설정, 캐릭터, 카메라, 오디오에 대한 상세한 영화적 속성을 창의적으로 채워 넣으십시오.
                   출력은 제공된 스키마를 엄격히 준수하는 단일 JSON 객체여야 합니다.`,
            instructions: "모든 텍스트 값은 한국어로 작성되어야 합니다.",
            errorGeneric: t.errorGeneric,
            errorInit: t.aiInitializationError,
        };
    }
    return {
        main: `You are a creative video director. A user will provide a concept for a video scene. Your task is to transform this concept into a detailed, structured VEO prompt JSON object.
               Creatively fill in detailed cinematic properties for scene settings, characters, camera, and audio.
               The output must be a single JSON object that strictly adheres to the provided schema.`,
        instructions: "",
        errorGeneric: t.errorGeneric,
        errorInit: t.aiInitializationError,
    };
};

export const generatePromptFromDescription = async (description: string, language: Language, model: ModelName): Promise<VeoPrompt> => {
    const t = getPromptGenerationInstructions(language);
    if (!ai) {
      throw new Error(t.errorInit);
    }
    
    const prompt = `${t.main}\n\nUSER CONCEPT: "${description}"\n\n${t.instructions}`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: PROMPT_SCHEMA,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as VeoPrompt;
    } catch (error) {
        console.error("Error generating scene:", error);
        throw new Error(t.errorGeneric);
    }
};

export const getSuggestionForField = async (
  fieldName: string,
  currentValue: string,
  context: string,
  language: Language,
  model: ModelName
): Promise<string> => {
  const t = getPromptGenerationInstructions(language);
  if (!ai) {
    throw new Error(t.errorInit);
  }
  const langInstruction = language === 'ko' ? 'The suggestion must be in Korean.' : 'The suggestion must be in English.';
  
  const prompt = `Based on the overall video concept, provide a creative suggestion to replace the current value for a specific field.
  
  Overall Concept: "${context}"
  
  Field to improve: "${fieldName}"
  Current value: "${currentValue}"
  
  Provide only the new suggested text, without any labels or extra formatting.
  ${langInstruction}
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error(`Error generating suggestion for ${fieldName}:`, error);
    throw new Error(t.errorGeneric);
  }
};