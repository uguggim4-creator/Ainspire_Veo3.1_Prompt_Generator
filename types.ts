// Fix: Removed circular import and added exports for all required types.
export type Language = 'en' | 'ko';
export type ModelName = 'gemini-2.5-flash' | 'gemini-2.5-pro';

export interface SceneSettings {
  overall_situation: string;
  background_details: {
    location: string;
    elements: string[];
  };
  video_style: {
    genre: string;
    look_and_feel: string;
    color_palette: string;
    lighting: string;
  };
}

export interface Character {
  name: string;
  appearance_and_action: {
    appearance: string;
    action: string;
  };
}

export interface CameraMovement {
  type: string;
  description: string;
}

export interface Dialogue {
    speaker: string;
    line: string;
}

export interface Audio {
  music: string;
  sfx: string[];
  dialogue?: Dialogue;
}

export interface VeoPrompt {
  scene_settings: SceneSettings;
  characters: Character[];
  camera_movement: CameraMovement;
  audio: Audio;
}