import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { SettingsPanel } from './components/SettingsPanel';
import { ResultPanel } from './components/ResultPanel';
import type { VeoPrompt, Language, ModelName } from './types';
import { generatePromptFromDescription, initializeAi, deinitializeAi } from './services/geminiService';
import { translations } from './i18n';
import { Icon } from './components/Icon';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('ko');
  const [model, setModel] = useState<ModelName>('gemini-2.5-flash');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [prompt, setPrompt] = useState<VeoPrompt | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const t = translations[language];

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini-api-key');
    if (storedKey) {
      setApiKey(storedKey);
      initializeAi(storedKey);
    }
    
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleKeySubmit = (key: string) => {
    localStorage.setItem('gemini-api-key', key);
    setApiKey(key);
    initializeAi(key);
  };

  const handleKeyClear = () => {
    localStorage.removeItem('gemini-api-key');
    setApiKey(null);
    deinitializeAi();
  };

  const clearPrompt = () => {
    setPrompt(null);
  }

  const handleGeneratePrompt = useCallback(async () => {
    if (!projectDescription) {
      setGenerationError(t.initialPromptPlaceholder);
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    setPrompt(null);

    try {
      const result: VeoPrompt = await generatePromptFromDescription(projectDescription, language, model);
      setPrompt(result);
    } catch (err) {
      setGenerationError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsGenerating(false);
    }
  }, [projectDescription, language, model, t]);


  const handlePromptUpdate = useCallback((jsonString: string) => {
    try {
      const parsedPrompt: VeoPrompt = JSON.parse(jsonString);
      setPrompt(parsedPrompt);
    } catch (e) {
      console.error("Invalid JSON input:", e);
    }
  }, []);

  const containerClasses = `w-full h-full bg-brand-dark/90 backdrop-blur-sm text-brand-text font-sans flex flex-col rounded-xl overflow-hidden shadow-2xl transform transition-all duration-700 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;

  if (!apiKey) {
    return (
      <div className={containerClasses}>
          <ApiKeySetup onSubmit={handleKeySubmit} language={language} setLanguage={setLanguage}/>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <Header 
        language={language} 
        setLanguage={setLanguage}
        model={model}
        setModel={setModel}
        title={t.title}
        description={t.description}
        handleKeyClear={handleKeyClear}
      />
      <main className="flex-grow flex p-4 sm:p-6 lg:p-8 gap-8 overflow-hidden">
        <div className="w-full lg:w-2/5 flex flex-col gap-6 h-full">
          <SettingsPanel
            projectDescription={projectDescription}
            setProjectDescription={setProjectDescription}
            prompt={prompt}
            setPrompt={setPrompt}
            clearPrompt={clearPrompt}
            onGeneratePrompt={handleGeneratePrompt}
            isGenerating={isGenerating}
            generationError={generationError}
            language={language}
            model={model}
          />
        </div>
        <div className="hidden lg:flex lg:w-3/5 h-full">
          <ResultPanel
            fullPrompt={prompt}
            onPromptChange={handlePromptUpdate}
            language={language}
          />
        </div>
      </main>
    </div>
  );
};


const ApiKeySetup: React.FC<{
  onSubmit: (key: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}> = ({ onSubmit, language, setLanguage }) => {
  const [key, setKey] = useState('');
  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onSubmit(key.trim());
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-brand-gray-dark/50">
      <div className="absolute top-4 right-4 flex items-center gap-1">
        <LanguageButton lang="en" currentLang={language} setLang={setLanguage} />
        <span className="text-brand-gray-light">/</span>
        <LanguageButton lang="ko" currentLang={language} setLang={setLanguage} />
      </div>

      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-brand-yellow mb-2">{t.title}</h1>
        <p className="text-brand-text-muted mb-8">{t.description}</p>
        
        <div className="bg-brand-dark p-8 rounded-lg shadow-lg border border-brand-gray-light">
          <h2 className="text-xl font-semibold text-brand-text mb-2">{t.apiKeySetupTitle}</h2>
          <p className="text-sm text-brand-text-muted mb-6">{t.apiKeySetupDescription}</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder={t.apiKeyInputPlaceholder}
              className="w-full bg-brand-gray p-3 rounded-md border border-brand-gray-light focus:outline-none focus:ring-2 focus:ring-brand-yellow text-center"
            />
            <button
              type="submit"
              disabled={!key.trim()}
              className="w-full bg-brand-yellow text-brand-dark font-bold py-3 px-4 rounded-lg transition-colors hover:bg-yellow-300 disabled:bg-brand-gray-light disabled:cursor-not-allowed"
            >
              {t.apiKeySaveButton}
            </button>
          </form>
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm text-brand-yellow hover:underline">
            {t.apiKeyGetHere}
          </a>
        </div>
      </div>
    </div>
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


export default App;