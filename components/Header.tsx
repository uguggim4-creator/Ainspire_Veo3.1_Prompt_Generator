import React from 'react';
import { Icon } from './Icon';
import { Language, ModelName } from '../types';
import { translations } from '../i18n';

interface HeaderProps {
    language: Language;
    setLanguage: (lang: Language) => void;
    model: ModelName;
    setModel: (model: ModelName) => void;
    title: string;
    description: string;
    handleKeyClear: () => void;
}

export const Header: React.FC<HeaderProps> = ({ language, setLanguage, model, setModel, title, description, handleKeyClear }) => {
  const t = translations[language];
  return (
    <header className="grid grid-cols-3 items-center p-4 bg-brand-dark border-b border-brand-gray-light flex-shrink-0">
      <div className="flex items-center gap-4 text-brand-text-muted justify-self-start">
         <div className="flex items-center gap-1">
            <LanguageButton lang="en" currentLang={language} setLang={setLanguage} />
            <span className="text-brand-gray-light">/</span>
            <LanguageButton lang="ko" currentLang={language} setLang={setLanguage} />
         </div>
         <ModelSwitcher currentModel={model} setModel={setModel} />
         <button onClick={handleKeyClear} className="text-xs hover:text-brand-yellow transition-colors">
            {t.resetApiKey}
         </button>
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-brand-yellow whitespace-nowrap">{title}</h1>
        <p className="text-sm text-brand-text-muted">{description}</p>
      </div>
      <div />
    </header>
  );
};

const LanguageButton: React.FC<{lang: Language, currentLang: Language, setLang: (lang: Language) => void}> = ({ lang, currentLang, setLang }) => (
    <button 
        onClick={() => setLang(lang)}
        className={`px-2 py-1 text-sm font-bold rounded-md transition-colors ${
            currentLang === lang ? 'bg-brand-yellow text-brand-dark' : 'text-brand-text-muted hover:bg-brand-gray'
        }`}
    >
        {lang.toUpperCase()}
    </button>
);

const ModelSwitcher: React.FC<{currentModel: ModelName, setModel: (model: ModelName) => void}> = ({ currentModel, setModel }) => {
    return (
        <div className="flex items-center bg-brand-gray rounded-md p-0.5">
            <ModelButton 
                modelName='gemini-2.5-flash'
                label='Flash'
                isActive={currentModel === 'gemini-2.5-flash'}
                onClick={() => setModel('gemini-2.5-flash')}
            />
            <ModelButton 
                modelName='gemini-2.5-pro'
                label='Pro'
                isActive={currentModel === 'gemini-2.5-pro'}
                onClick={() => setModel('gemini-2.5-pro')}
            />
        </div>
    );
};

const ModelButton: React.FC<{modelName: ModelName, label: string, isActive: boolean, onClick: () => void}> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-2 py-0.5 text-xs font-semibold rounded-[4px] transition-colors ${
            isActive ? 'bg-brand-yellow text-brand-dark' : 'text-brand-text-muted hover:bg-brand-gray-light'
        }`}
    >
        {label}
    </button>
);