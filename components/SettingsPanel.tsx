import React, { useState, useRef, useEffect } from 'react';
import type { VeoPrompt, Language, Character, SceneSettings, CameraMovement, Audio, ModelName } from '../types';
import { Icon } from './Icon';
import { translations, options } from '../i18n';
import { getSuggestionForField } from '../services/geminiService';

interface SettingsPanelProps {
  projectDescription: string;
  setProjectDescription: (value: string) => void;
  prompt: VeoPrompt | null;
  setPrompt: React.Dispatch<React.SetStateAction<VeoPrompt | null>>;
  clearPrompt: () => void;
  onGeneratePrompt: () => void;
  isGenerating: boolean;
  generationError: string | null;
  language: Language;
  model: ModelName;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  projectDescription,
  setProjectDescription,
  prompt,
  setPrompt,
  clearPrompt,
  onGeneratePrompt,
  isGenerating,
  generationError,
  language,
  model,
}) => {
  const t = translations[language];
  const hasPrompt = prompt !== null;

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-col gap-4 p-4 bg-brand-gray-dark rounded-lg border border-brand-gray-light overflow-hidden h-full">
        <div className="flex-grow overflow-y-auto pr-2 -mr-4">
          <div className="flex flex-col gap-4">
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder={t.initialPromptPlaceholder}
              className="w-full bg-brand-gray text-lg text-brand-text placeholder-brand-text-muted focus:outline-none resize-none p-3 rounded-md border border-brand-gray-light focus:ring-2 focus:ring-brand-yellow"
              rows={4}
            />
            <div className="flex items-center gap-2">
              <button
                onClick={onGeneratePrompt}
                disabled={isGenerating}
                className="flex-grow flex items-center justify-center gap-2 bg-brand-yellow text-brand-dark font-bold py-2.5 px-4 rounded-lg transition-colors hover:bg-yellow-300 disabled:bg-brand-gray-light disabled:text-brand-text-muted disabled:cursor-wait"
              >
                {isGenerating ? <><Icon name="spinner" className="animate-spin" /> {t.generatingPrompt}</> : <><Icon name="sparkles" /> {hasPrompt ? t.regeneratePrompt : t.generatePrompt}</>}
              </button>
              {hasPrompt && (
                <button
                  onClick={clearPrompt}
                  disabled={isGenerating}
                  className="flex-shrink-0 bg-brand-gray hover:bg-red-500/20 text-brand-text-muted hover:text-red-400 font-bold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50"
                  aria-label={t.clearPrompt}
                >
                  <Icon name="trash" />
                </button>
              )}
            </div>
            {generationError && <p className="text-sm text-red-400 text-center -mt-2">{generationError}</p>}
            
            <div className="space-y-3 pt-4 border-t border-brand-gray-light">
              {prompt && (
                <PromptEditor 
                  prompt={prompt} 
                  setPrompt={setPrompt} 
                  language={language} 
                  projectDescription={projectDescription}
                  model={model}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PromptEditor: React.FC<{
  prompt: VeoPrompt;
  setPrompt: React.Dispatch<React.SetStateAction<VeoPrompt | null>>;
  language: Language;
  projectDescription: string;
  model: ModelName;
}> = ({ prompt, setPrompt, language, projectDescription, model }) => {
  const t = translations[language];
  const [suggestingField, setSuggestingField] = useState<string | null>(null);

  const updateField = (updateFn: (p: VeoPrompt) => VeoPrompt) => {
      setPrompt(prev => prev ? updateFn(prev) : null);
  };

  const handleSuggest = async (fieldKey: string, fieldName: string, currentValue: string, updateFn: (suggestion: string) => void) => {
    if (!projectDescription) return;
    setSuggestingField(fieldKey);
    try {
        const suggestion = await getSuggestionForField(fieldName, currentValue, projectDescription, language, model);
        updateFn(suggestion);
    } catch (e) {
        console.error(e);
    } finally {
        setSuggestingField(null);
    }
  };
  
  return (
    <div className="flex flex-col gap-3">
      <Accordion title={t.sceneSettings} icon="map-pin" defaultOpen>
        <SceneSettingsEditor 
          settings={prompt.scene_settings} 
          onChange={newSettings => updateField(p => ({...p, scene_settings: newSettings}))} 
          language={language}
          onSuggest={handleSuggest}
          suggestingField={suggestingField}
        />
      </Accordion>
      <Accordion title={t.characters} icon="user" defaultOpen>
        <CharactersEditor 
          characters={prompt.characters} 
          onChange={newChars => updateField(p => ({...p, characters: newChars}))} 
          language={language}
          onSuggest={handleSuggest}
          suggestingField={suggestingField}
        />
      </Accordion>
      <Accordion title={t.cameraMovement} icon="camera" defaultOpen>
        <CameraEditor 
          camera={prompt.camera_movement} 
          onChange={newCam => updateField(p => ({...p, camera_movement: newCam}))} 
          language={language}
          onSuggest={handleSuggest}
          suggestingField={suggestingField}
        />
      </Accordion>
      <Accordion title={t.audio} icon="volume-up" defaultOpen>
        <AudioEditor 
          audio={prompt.audio} 
          characters={prompt.characters}
          onChange={newAudio => updateField(p => ({...p, audio: newAudio}))} 
          language={language}
          onSuggest={handleSuggest}
          suggestingField={suggestingField}
        />
      </Accordion>
    </div>
  );
};

// Reusable Components
const Accordion: React.FC<{title: string, icon: string, children: React.ReactNode, defaultOpen?: boolean}> = ({title, icon, children, defaultOpen = false}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="bg-brand-gray p-3 rounded-md">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left">
                <h3 className="text-md font-semibold text-brand-yellow flex items-center gap-2">
                  <Icon name={icon} className="w-5 h-5" /> {title}
                </h3>
                <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} className="w-5 h-5 text-brand-text-muted" />
            </button>
            {isOpen && <div className="pt-3 mt-3 border-t border-brand-gray-light">{children}</div>}
        </div>
    );
}

const SuggestiveInputField: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  onSuggest: () => void;
  isSuggesting: boolean;
  t: any;
}> = ({ label, value, onChange, onSuggest, isSuggesting, t }) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-brand-text-muted">{label}</label>
        <div className="flex items-center gap-2">
          <input type="text" value={value} onChange={e => onChange(e.target.value)} className="w-full bg-brand-gray-light p-2 rounded-md border border-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
          <button 
            onClick={onSuggest}
            disabled={isSuggesting}
            className="p-2 text-brand-yellow hover:bg-brand-yellow/20 rounded-full transition-colors disabled:opacity-50 disabled:cursor-wait"
            title={t.replaceWithAI}
          >
            {isSuggesting ? <Icon name="spinner" className="w-4 h-4 animate-spin" /> : <Icon name="sparkles" className="w-4 h-4" />}
          </button>
        </div>
    </div>
);

const ComboBoxField: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
}> = ({ label, value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative flex flex-col gap-1" ref={wrapperRef}>
      <label className="text-sm font-medium text-brand-text-muted">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full bg-brand-gray-light p-2 pr-10 rounded-md border border-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-yellow"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute inset-y-0 right-0 flex items-center px-2 text-brand-text-muted hover:text-brand-text"
          aria-label="Toggle options"
        >
          <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} className="w-5 h-5" />
        </button>
      </div>
      {isOpen && (
        <ul className="absolute z-20 top-full mt-1 w-full bg-brand-gray-light border border-brand-gray rounded-md shadow-lg max-h-60 overflow-auto">
          {options.length > 0 ? options.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                onClick={() => handleOptionClick(opt)}
                className="w-full text-left px-3 py-2 text-sm text-brand-text hover:bg-brand-yellow/20"
              >
                {opt}
              </button>
            </li>
          )) : (
            <li className="px-3 py-2 text-sm text-brand-text-muted">No options available</li>
          )}
        </ul>
      )}
    </div>
  );
};


const StringArrayEditor: React.FC<{label: string, items: string[], onChange: (items: string[]) => void, t: any}> = ({label, items, onChange, t}) => {
    const handleItemChange = (index: number, value: string) => {
        const newItems = [...items];
        newItems[index] = value;
        onChange(newItems);
    };
    const handleAddItem = () => onChange([...items, '']);
    const handleRemoveItem = (index: number) => onChange(items.filter((_, i) => i !== index));

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-brand-text-muted">{label}</label>
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <input type="text" value={item} onChange={e => handleItemChange(index, e.target.value)} className="w-full bg-brand-gray-light p-2 rounded-md border border-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
                    <button onClick={() => handleRemoveItem(index)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-full transition-colors"><Icon name="trash" className="w-4 h-4" /></button>
                </div>
            ))}
            <button onClick={handleAddItem} className="text-sm text-brand-yellow hover:underline self-start">{label === t.elements ? t.addElement : t.addSfx}</button>
        </div>
    );
};

// Editor Props
interface EditorProps {
  language: Language;
  onSuggest: (fieldKey: string, fieldName: string, currentValue: string, updateFn: (suggestion: string) => void) => void;
  suggestingField: string | null;
}

// Specific Section Editors
const SceneSettingsEditor: React.FC<{settings: SceneSettings, onChange: (s: SceneSettings) => void} & EditorProps> = ({settings, onChange, language, onSuggest, suggestingField}) => {
    const t = translations[language];
    const opts = options[language];
    return (
        <div className="space-y-4">
            <SuggestiveInputField label={t.overallSituation} value={settings.overall_situation} onChange={v => onChange({...settings, overall_situation: v})}
              onSuggest={() => onSuggest('ss_overall', t.overallSituation, settings.overall_situation, s => onChange({...settings, overall_situation: s}))}
              isSuggesting={suggestingField === 'ss_overall'} t={t} />
            <div className="bg-brand-gray/50 p-3 rounded-md space-y-2">
                <h4 className="font-semibold text-brand-text">{t.backgroundDetails}</h4>
                <SuggestiveInputField label={t.location} value={settings.background_details.location} onChange={v => onChange({...settings, background_details: {...settings.background_details, location: v}})}
                  onSuggest={() => onSuggest('ss_location', t.location, settings.background_details.location, s => onChange({...settings, background_details: {...settings.background_details, location: s}}))}
                  isSuggesting={suggestingField === 'ss_location'} t={t} />
                <StringArrayEditor label={t.elements} items={settings.background_details.elements} onChange={v => onChange({...settings, background_details: {...settings.background_details, elements: v}})} t={t} />
            </div>
            <div className="bg-brand-gray/50 p-3 rounded-md space-y-2">
                <h4 className="font-semibold text-brand-text">{t.videoStyle}</h4>
                <ComboBoxField label={t.genre} value={settings.video_style.genre} onChange={v => onChange({...settings, video_style: {...settings.video_style, genre: v}})} options={opts.genres} />
                <SuggestiveInputField label={t.lookAndFeel} value={settings.video_style.look_and_feel} onChange={v => onChange({...settings, video_style: {...settings.video_style, look_and_feel: v}})} 
                  onSuggest={() => onSuggest('ss_look', t.lookAndFeel, settings.video_style.look_and_feel, s => onChange({...settings, video_style: {...settings.video_style, look_and_feel: s}}))}
                  isSuggesting={suggestingField === 'ss_look'} t={t} />
                <SuggestiveInputField label={t.colorPalette} value={settings.video_style.color_palette} onChange={v => onChange({...settings, video_style: {...settings.video_style, color_palette: v}})} 
                  onSuggest={() => onSuggest('ss_color', t.colorPalette, settings.video_style.color_palette, s => onChange({...settings, video_style: {...settings.video_style, color_palette: s}}))}
                  isSuggesting={suggestingField === 'ss_color'} t={t} />
                <SuggestiveInputField label={t.lighting} value={settings.video_style.lighting} onChange={v => onChange({...settings, video_style: {...settings.video_style, lighting: v}})} 
                  onSuggest={() => onSuggest('ss_lighting', t.lighting, settings.video_style.lighting, s => onChange({...settings, video_style: {...settings.video_style, lighting: s}}))}
                  isSuggesting={suggestingField === 'ss_lighting'} t={t} />
            </div>
        </div>
    );
}

const CharactersEditor: React.FC<{characters: Character[], onChange: (c: Character[]) => void} & EditorProps> = ({characters, onChange, language, onSuggest, suggestingField}) => {
    const t = translations[language];
    
    const handleUpdate = (index: number, updatedChar: Character) => {
        const newChars = [...characters];
        newChars[index] = updatedChar;
        onChange(newChars);
    };

    const handleAdd = () => {
        const newChar: Character = { name: '', appearance_and_action: { appearance: '', action: ''}};
        onChange([...characters, newChar]);
    }
    const handleRemove = (index: number) => onChange(characters.filter((_, i) => i !== index));

    return (
        <div className="space-y-4">
            {characters.map((char, index) => (
                <div key={index} className="bg-brand-gray/50 p-3 rounded-md space-y-2 relative">
                    <button onClick={() => handleRemove(index)} className="absolute top-2 right-2 p-1 text-red-400 hover:bg-red-500/20 rounded-full"><Icon name="x-circle" className="w-5 h-5"/></button>
                    <SuggestiveInputField label={t.characterName} value={char.name} onChange={v => handleUpdate(index, {...char, name: v})} 
                      onSuggest={() => onSuggest(`char_${index}_name`, t.characterName, char.name, s => handleUpdate(index, {...char, name: s}))}
                      isSuggesting={suggestingField === `char_${index}_name`} t={t} />
                    <SuggestiveInputField label={t.appearance} value={char.appearance_and_action.appearance} onChange={v => handleUpdate(index, {...char, appearance_and_action: {...char.appearance_and_action, appearance: v}})} 
                      onSuggest={() => onSuggest(`char_${index}_app`, t.appearance, char.appearance_and_action.appearance, s => handleUpdate(index, {...char, appearance_and_action: {...char.appearance_and_action, appearance: s}}))}
                      isSuggesting={suggestingField === `char_${index}_app`} t={t} />
                    <SuggestiveInputField label={t.action} value={char.appearance_and_action.action} onChange={v => handleUpdate(index, {...char, appearance_and_action: {...char.appearance_and_action, action: v}})} 
                      onSuggest={() => onSuggest(`char_${index}_act`, t.action, char.appearance_and_action.action, s => handleUpdate(index, {...char, appearance_and_action: {...char.appearance_and_action, action: s}}))}
                      isSuggesting={suggestingField === `char_${index}_act`} t={t} />
                </div>
            ))}
            <button onClick={handleAdd} className="w-full flex items-center justify-center gap-2 bg-brand-yellow/20 text-brand-yellow font-semibold py-2 px-3 rounded-lg hover:bg-brand-yellow/30 transition-colors">
                <Icon name="plus-circle" /> {t.addCharacter}
            </button>
        </div>
    )
}

const CameraEditor: React.FC<{camera: CameraMovement, onChange: (c: CameraMovement) => void} & EditorProps> = ({camera, onChange, language, onSuggest, suggestingField}) => {
    const t = translations[language];
    const opts = options[language];
    return (
        <div className="space-y-4">
            <ComboBoxField label={t.cameraType} value={camera.type} onChange={v => onChange({...camera, type: v})} options={opts.cameraTypes} />
            <SuggestiveInputField label={t.cameraDescription} value={camera.description} onChange={v => onChange({...camera, description: v})} 
              onSuggest={() => onSuggest('cam_desc', t.cameraDescription, camera.description, s => onChange({...camera, description: s}))}
              isSuggesting={suggestingField === 'cam_desc'} t={t} />
        </div>
    )
}

const AudioEditor: React.FC<{audio: Audio, characters: Character[], onChange: (a: Audio) => void} & EditorProps> = ({audio, characters, onChange, language, onSuggest, suggestingField}) => {
    const t = translations[language];
    const characterNames = characters.map(c => c.name).filter(Boolean);

    return (
        <div className="space-y-4">
            <SuggestiveInputField label={t.music} value={audio.music} onChange={v => onChange({...audio, music: v})}
              onSuggest={() => onSuggest('audio_music', t.music, audio.music, s => onChange({...audio, music: s}))}
              isSuggesting={suggestingField === 'audio_music'} t={t} />
            <StringArrayEditor label={t.sfx} items={audio.sfx} onChange={v => onChange({...audio, sfx: v})} t={t} />
            <div className="bg-brand-gray/50 p-3 rounded-md space-y-2">
                <h4 className="font-semibold text-brand-text">{t.dialogue}</h4>
                <ComboBoxField label={t.dialogueSpeaker} value={audio.dialogue?.speaker || ''} onChange={v => onChange({...audio, dialogue: {...audio.dialogue, speaker: v}})} options={characterNames} />
                <SuggestiveInputField label={t.dialogueLine} value={audio.dialogue?.line || ''} onChange={v => onChange({...audio, dialogue: {...audio.dialogue, line: v}})} 
                  onSuggest={() => onSuggest('audio_line', t.dialogueLine, audio.dialogue?.line || '', s => onChange({...audio, dialogue: {...audio.dialogue, line: s}}))}
                  isSuggesting={suggestingField === 'audio_line'} t={t} />
            </div>
        </div>
    )
}