import { Language } from './types';

type TranslationKeys = {
  // Header
  title: string;
  description: string;
  resetApiKey: string;
  // API Key Setup
  apiKeySetupTitle: string;
  apiKeySetupDescription: string;
  apiKeyInputPlaceholder: string;
  apiKeySaveButton: string;
  apiKeyGetHere: string;
  // Settings Panel
  initialPromptPlaceholder: string;
  generatePrompt: string;
  regeneratePrompt: string;
  generatingPrompt: string;
  clearPrompt: string;
  replaceWithAI: string;
  generatingSuggestion: string;
  // Editors
  sceneSettings: string;
  overallSituation: string;
  backgroundDetails: string;
  location: string;
  elements: string;
  addElement: string;
  videoStyle: string;
  genre: string;
  lookAndFeel: string;
  colorPalette: string;
  lighting: string;
  characters: string;
  characterName: string;
  appearanceAndAction: string;
  appearance: string;
  action: string;
  addCharacter: string;
  removeCharacter: string;
  cameraMovement: string;
  cameraType: string;
  cameraDescription: string;
  audio: string;
  music: string;
  sfx: string;
  addSfx: string;
  dialogue: string;
  dialogueSpeaker: string;
  dialogueLine: string;
  // Result Panel
  copyJson: string;
  copied: string;
  resultPlaceholder: string;
  // Errors
  errorGeneric: string;
  aiInitializationError: string;
};

export const translations: Record<Language, TranslationKeys> = {
  en: {
    title: 'Ainspire VEO 3.1 Prompt Generator',
    description: 'Automatically design sophisticated JSON-based prompts',
    resetApiKey: 'Reset API Key',
    apiKeySetupTitle: 'Set up your Gemini API Key',
    apiKeySetupDescription: 'To use this application, please enter your Google Gemini API key. Your key will be stored locally in your browser and will not be shared.',
    apiKeyInputPlaceholder: 'Enter your API Key',
    apiKeySaveButton: 'Save and Start',
    apiKeyGetHere: 'Get your API key here.',
    initialPromptPlaceholder: 'Describe the video scene you want to create...',
    generatePrompt: 'Generate Prompt',
    regeneratePrompt: 'Regenerate Prompt',
    generatingPrompt: 'Generating Prompt...',
    clearPrompt: 'Clear Prompt',
    replaceWithAI: 'Replace with AI suggestion',
    generatingSuggestion: 'Generating...',
    sceneSettings: 'Scene Settings',
    overallSituation: 'Overall Situation',
    backgroundDetails: 'Background Details',
    location: 'Location',
    elements: 'Elements',
    addElement: 'Add Element',
    videoStyle: 'Video Style',
    genre: 'Style',
    lookAndFeel: 'Look & Feel',
    colorPalette: 'Color Palette',
    lighting: 'Lighting',
    characters: 'Characters',
    characterName: 'Character Name',
    appearanceAndAction: 'Appearance & Action',
    appearance: 'Appearance',
    action: 'Action',
    addCharacter: 'Add Character',
    removeCharacter: 'Remove Character',
    cameraMovement: 'Camera Movement',
    cameraType: 'Type',
    cameraDescription: 'Description',
    audio: 'Audio',
    music: 'Music',
    sfx: 'Sound Effects (SFX)',
    addSfx: 'Add SFX',
    dialogue: 'Dialogue',
    dialogueSpeaker: 'Speaker',
    dialogueLine: 'Line',
    copyJson: 'Copy JSON',
    copied: 'Copied!',
    resultPlaceholder: 'Your generated prompt will appear here in real-time',
    errorGeneric: 'Failed to generate prompt. Please adjust your input or try again later.',
    aiInitializationError: 'AI not initialized. Please set your API key.',
  },
  ko: {
    title: 'Ainspire VEO 3.1 Prompt Generator',
    description: '정교한 JSON 기반 프롬프트를 자동 설계',
    resetApiKey: 'API 키 재설정',
    apiKeySetupTitle: 'Gemini API 키 설정',
    apiKeySetupDescription: '이 애플리케이션을 사용하려면 Google Gemini API 키를 입력하세요. 키는 공유되지 않습니다.',
    apiKeyInputPlaceholder: 'API 키를 입력하세요',
    apiKeySaveButton: '저장하고 시작하기',
    apiKeyGetHere: '여기에서 API 키를 받으세요.',
    initialPromptPlaceholder: '만들고 싶은 영상 장면을 설명해주세요...',
    generatePrompt: '프롬프트 생성',
    regeneratePrompt: '프롬프트 다시 생성',
    generatingPrompt: '프롬프트 생성 중...',
    clearPrompt: '프롬프트 지우기',
    replaceWithAI: 'AI 추천으로 교체',
    generatingSuggestion: '생성 중...',
    sceneSettings: '장면 설정',
    overallSituation: '전체 상황',
    backgroundDetails: '배경 상세',
    location: '장소',
    elements: '구성 요소',
    addElement: '요소 추가',
    videoStyle: '비디오 스타일',
    genre: '스타일',
    lookAndFeel: '룩앤필',
    colorPalette: '색상 팔레트',
    lighting: '조명',
    characters: '캐릭터',
    characterName: '캐릭터 이름',
    appearanceAndAction: '외형 및 행동',
    appearance: '외형',
    action: '행동',
    addCharacter: '캐릭터 추가',
    removeCharacter: '캐릭터 삭제',
    cameraMovement: '카메라 움직임',
    cameraType: '유형',
    cameraDescription: '설명',
    audio: '오디오',
    music: '음악',
    sfx: '음향 효과 (SFX)',
    addSfx: '음향 효과 추가',
    dialogue: '대사',
    dialogueSpeaker: '화자',
    dialogueLine: '대사',
    copyJson: 'JSON 복사',
    copied: '복사됨!',
    resultPlaceholder: '생성된 프롬프트가 여기에 실시간으로 표시됩니다',
    errorGeneric: '프롬프트를 생성하지 못했습니다. 입력 내용을 수정하거나 나중에 다시 시도하십시오.',
    aiInitializationError: 'AI가 초기화되지 않았습니다. API 키를 설정해주세요.',
  },
};

export const options = {
  en: {
    genres: ['Noir', 'Cyberpunk', 'Cartoon', 'Anime', 'Documentary Style', 'Vintage Film', 'Cinematic Vlog', 'Hyper-realistic CGI', 'Minimalist'],
    cameraTypes: ['Static Shot', 'Panning Shot', 'Tilting Shot', 'Dolly Shot', 'Trucking Shot', 'Tracking Shot', 'Crane Shot', 'Handheld Shot', 'Zoom', 'Dolly Zoom', 'Dutch Angle', 'Point of View (POV) Shot', 'Extreme Close Up', 'Close Up', 'Medium Shot', 'Long Shot', 'Establishing Shot']
  },
  ko: {
    genres: ['느와르', '사이버펑크', '카툰 스타일', '애니메이션', '다큐멘터리 스타일', '빈티지 필름', '시네마틱 브이로그', '초현실적 CGI', '미니멀리스트'],
    cameraTypes: ['고정 샷', '패닝 샷', '틸팅 샷', '달리 샷', '트래킹 샷', '추적 샷', '크레인 샷', '핸드헬드 샷', '줌', '달리 줌', '더치 앵글', '1인칭 시점 (POV) 샷', '익스트림 클로즈업', '클로즈업', '미디엄 샷', '롱 샷', '확립 샷']
  }
};