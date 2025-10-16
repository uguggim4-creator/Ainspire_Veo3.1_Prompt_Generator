import React, { useState, useEffect } from 'react';
import type { VeoPrompt, Language } from '../types';
import { Icon } from './Icon';
import { translations } from '../i18n';

interface ResultPanelProps {
  fullPrompt: VeoPrompt | null;
  onPromptChange: (jsonString: string) => void;
  language: Language;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({ fullPrompt, onPromptChange, language }) => {
  const [jsonText, setJsonText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const t = translations[language];

  useEffect(() => {
    if (fullPrompt) {
      setJsonText(JSON.stringify(fullPrompt, null, 2));
    } else {
      setJsonText('');
    }
  }, [fullPrompt]);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
    setCopySuccess(true);
  };

  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => setCopySuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    setJsonText(newText);
    onPromptChange(newText);
  };

  const renderContent = () => {
    if (fullPrompt) {
      return (
        <div className="relative h-full flex flex-col">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleCopy}
              className="bg-brand-gray hover:bg-brand-gray-light text-brand-text p-2 rounded-md transition-colors flex items-center gap-2 text-sm"
              aria-label="Copy JSON prompt"
            >
              {copySuccess ? <Icon name="check" className="text-green-400" /> : <Icon name="copy" />}
              {copySuccess ? t.copied : t.copyJson}
            </button>
          </div>
          <textarea
            value={jsonText}
            onChange={handleChange}
            className="w-full h-full bg-brand-gray p-4 rounded-md font-mono text-sm text-brand-text border-none focus:outline-none focus:ring-2 focus:ring-brand-yellow resize-none"
            spellCheck="false"
          />
        </div>
      );
    }

    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <p className="text-brand-text-muted text-lg text-center">{t.resultPlaceholder}</p>
      </div>
    );
  };

  return (
    <div className="bg-brand-gray-dark rounded-lg w-full h-full border border-brand-gray-light relative">
      {renderContent()}
    </div>
  );
};
