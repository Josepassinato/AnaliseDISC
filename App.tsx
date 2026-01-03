
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { QUESTIONS, PROFILE_DESCRIPTIONS, DISC_DEFINITIONS } from './constants';
import { ProfileType, AssessmentResult, AIAnalysis, MinistryAffinity } from './types';
import { generateBehavioralAnalysis, generateProfileImage } from './geminiService';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer
} from 'recharts';

// --- Icons ---
const BackIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
);

const ChartPieIcon = () => (
  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
);

const UserGroupIcon = () => (
  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
);

const LightBulbIcon = () => (
  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.674a1 1 0 00.951-.662l1.103-3.283A4.459 4.459 0 0015.311 9H8.689c-.642 0-1.267.14-1.826.41L5.76 12.055a1 1 0 00.951.662H9.663zM9 21h6m-3-3v3m-3-3h6" /></svg>
);

const ChurchIcon = () => (
  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
);

const HeartIcon = () => (
  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
);

const DownloadIcon = () => (
  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);

const XIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);

const FileTextIcon = () => (
  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
);

const SpinnerIcon = () => (
  <svg className="animate-spin w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// --- Subcomponents ---

const Toast = ({ message, type, isVisible }: { message: string, type: 'success' | 'info', isVisible: boolean }) => (
  <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-90 pointer-events-none'}`}>
    <div className={`px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-black text-sm md:text-base tracking-tight ${type === 'success' ? 'bg-orange-600 text-white' : 'bg-black text-white'}`}>
      {type === 'success' ? <CheckIcon /> : <FileTextIcon />}
      {message}
    </div>
  </div>
);

const DiscModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-neutral-400 hover:text-black transition-colors p-2 bg-neutral-50 rounded-full"
        >
          <XIcon />
        </button>
        
        <div className="p-8 md:p-12">
          <div className="bg-orange-600 w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6">
            <BookIcon />
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-black mb-4">O que é a Metodologia DISC?</h3>
          <p className="text-neutral-500 text-base md:text-lg leading-relaxed mb-8 font-medium">
            O teste DISC é uma ferramenta de análise comportamental que identifica quatro traços fundamentais que ditam como reagimos ao mundo:
          </p>
          
          <div className="space-y-4">
            {[
              { l: 'D', t: 'Dominância', d: 'Como você lida com problemas e desafios.', c: 'bg-red-50 text-red-600' },
              { l: 'I', t: 'Influência', d: 'Como você lida com pessoas e as influencia.', c: 'bg-yellow-50 text-yellow-600' },
              { l: 'S', t: 'Estabilidade', d: 'Como você lida com mudanças e ritmo.', c: 'bg-green-50 text-green-600' },
              { l: 'C', t: 'Conformidade', d: 'Como você lida com regras e processos.', c: 'bg-blue-50 text-blue-600' }
            ].map((item) => (
              <div key={item.l} className="flex gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-100 items-start">
                <span className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg shrink-0 ${item.c}`}>
                  {item.l}
                </span>
                <div>
                  <h4 className="font-black text-black text-sm uppercase tracking-wider">{item.t}</h4>
                  <p className="text-xs md:text-sm text-neutral-500 font-semibold">{item.d}</p>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={onClose}
            className="w-full mt-10 bg-black text-white py-4 rounded-full font-black text-lg hover:bg-orange-600 transition-all shadow-xl"
          >
            Entendi, vamos lá!
          </button>
        </div>
      </div>
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
};

const Header = ({ setStep, onBack, showBack }: { setStep: (step: any) => void, onBack: () => void, showBack: boolean }) => (
  <header className="bg-white/90 backdrop-blur-md border-b border-neutral-100 sticky top-0 z-50 print:hidden">
    <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBack && (
          <button 
            onClick={onBack}
            className="p-2 -ml-2 text-neutral-400 hover:text-orange-600 transition-colors rounded-full hover:bg-neutral-50"
            title="Voltar"
          >
            <BackIcon />
          </button>
        )}
        <div className="flex items-center gap-2 md:gap-4 cursor-pointer" onClick={() => setStep('landing')}>
          <div className="bg-orange-600 p-1.5 md:p-2.5 rounded-lg md:rounded-xl text-white shadow-sm">
            <ChurchIcon />
          </div>
          <h1 className="text-xl md:text-3xl font-black text-black tracking-tighter">EMB Church</h1>
        </div>
      </div>
      
      <nav className="flex items-center gap-3 md:gap-6">
        <button onClick={() => setStep('methodology')} className="text-xs md:text-base font-bold text-neutral-500 hover:text-orange-600 transition-colors uppercase tracking-widest hidden sm:block">
          Metodologia
        </button>
        <button onClick={() => setStep('quiz')} className="bg-orange-600 text-white text-[10px] md:text-sm font-black px-4 md:px-8 py-2 md:py-3 rounded-full uppercase tracking-widest hover:bg-black transition-all">
          Avaliação
        </button>
      </nav>
    </div>
  </header>
);

const LandingPage = ({ onStart, onOpenDisc, userName, setUserName }: { 
  onStart: () => void, 
  onOpenDisc: () => void,
  userName: string,
  setUserName: (val: string) => void
}) => (
  <div className="max-w-4xl mx-auto text-center py-10 md:py-20 px-4 md:px-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
    <div className="mb-6 md:mb-8 flex justify-center">
      <div className="bg-orange-500/5 p-4 md:p-6 rounded-2xl text-orange-600">
        <ChurchIcon />
      </div>
    </div>
    
    <span className="text-xs md:text-sm font-black text-orange-600 uppercase tracking-[0.4em] mb-4 block">
      Análise de Perfil Comportamental
    </span>
    
    <h2 className="text-3xl md:text-7xl font-extrabold text-black mb-6 md:mb-8 tracking-tighter leading-tight">
      Descubra sua <span className="text-orange-600">Essência</span> e Potencialize seu Impacto
    </h2>
    <p className="text-lg md:text-2xl text-neutral-500 mb-8 md:mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
      Entenda seus padrões naturais de comportamento para aprimorar sua comunicação, liderança e atuação ministerial.
    </p>

    <div className="max-w-md mx-auto mb-10 md:mb-16 bg-white p-1.5 md:p-2 rounded-2xl md:rounded-[2rem] border-2 border-neutral-100 shadow-lg md:shadow-xl shadow-neutral-100 focus-within:border-orange-500 transition-all">
      <div className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4">
        <div className="text-neutral-300">
          <UserIcon />
        </div>
        <input 
          type="text" 
          placeholder="Seu nome completo..."
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-lg md:text-xl font-bold text-black placeholder:text-neutral-300 placeholder:font-medium"
        />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-10 md:mb-16 text-left">
      {[
        { icon: <UserGroupIcon />, title: "Comportamento", desc: "Analise como você reage a desafios e interage com pessoas." },
        { icon: <HeartIcon />, title: "Ministério", desc: "Identifique as áreas de serviço que mais ressoam com você." },
        { icon: <ChartPieIcon />, title: "Estratégia", desc: "Receba um plano de desenvolvimento personalizado." }
      ].map((item, idx) => (
        <div key={idx} className="p-6 md:p-8 bg-white rounded-3xl md:rounded-[2.5rem] shadow-sm border border-neutral-100">
          <div className="text-orange-600 mb-4 md:mb-6 scale-125 md:scale-150 origin-left">{item.icon}</div>
          <h3 className="text-lg md:text-xl font-black text-black mb-2 md:mb-3">{item.title}</h3>
          <p className="text-sm md:text-base text-neutral-500 font-semibold leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
    
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
      <button 
        onClick={onStart} 
        disabled={!userName.trim()}
        className={`w-full sm:w-auto text-lg md:text-xl font-black py-4 md:py-6 px-10 md:px-14 rounded-full transition-all transform hover:scale-105 shadow-xl active:scale-95 ${
          userName.trim() ? 'bg-orange-600 text-white hover:bg-black' : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
        }`}
      >
        Iniciar Jornada
      </button>
      <button 
        onClick={onOpenDisc} 
        className="text-neutral-500 hover:text-black font-black text-base md:text-lg py-4 px-8 rounded-full flex items-center gap-2 md:gap-3 transition-colors"
      >
        <BookIcon /> O que é DISC?
      </button>
    </div>
  </div>
);

const IntroPage = ({ onContinue, userName }: { onContinue: () => void, userName: string }) => (
  <div className="max-w-4xl mx-auto py-10 md:py-20 px-4 md:px-6 animate-in fade-in duration-700">
    <div className="text-center mb-10 md:mb-16">
      <span className="text-xs md:text-sm font-black text-orange-600 uppercase tracking-[0.4em] mb-4 block">Preparação</span>
      <h2 className="text-3xl md:text-6xl font-black text-black mb-6 tracking-tighter">Olá, {userName.split(' ')[0]}!</h2>
      <p className="text-lg md:text-2xl text-neutral-500 max-w-2xl mx-auto font-medium leading-relaxed">
        Antes de começarmos, entenda que a <span className="text-black font-black">Análise de Perfil DISC</span> não é um teste de inteligência, mas um mapa da sua essência.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
      <div className="bg-neutral-50 p-8 rounded-[2.5rem] border border-neutral-100">
        <h3 className="text-xl md:text-2xl font-black mb-4">Como responder?</h3>
        <p className="text-neutral-600 font-semibold leading-relaxed">
          Seja honesto consigo mesmo. Não responda como você "acha que deveria ser", mas como você <span className="text-orange-600">realmente age</span> no dia a dia. Pense em situações reais da sua vida.
        </p>
      </div>
      <div className="bg-neutral-50 p-8 rounded-[2.5rem] border border-neutral-100">
        <h3 className="text-xl md:text-2xl font-black mb-4">O que esperar?</h3>
        <p className="text-neutral-600 font-semibold leading-relaxed">
          Ao final, você receberá um relatório completo detalhando suas forças, áreas de crescimento e os 3 ministérios que mais combinam com o seu perfil natural.
        </p>
      </div>
    </div>

    <div className="flex justify-center">
      <button 
        onClick={onContinue}
        className="w-full sm:w-auto bg-black text-white text-xl font-black py-6 px-16 rounded-full hover:bg-orange-600 transition-all shadow-2xl active:scale-95 transform hover:scale-105"
      >
        Estou Pronto!
      </button>
    </div>
  </div>
);

const MethodologySection = ({ onStart }: { onStart: () => void }) => (
  <div className="max-w-4xl mx-auto py-10 md:py-20 px-4 md:px-6 animate-in fade-in duration-700">
    <div className="text-center mb-10 md:mb-16">
      <h2 className="text-3xl md:text-5xl font-black text-black mb-3 md:mb-4">Metodologia <span className="text-orange-600">DISC</span></h2>
      <p className="text-lg md:text-xl text-neutral-500 max-w-xl mx-auto font-medium">Os quatro pilares fundamentais que moldam a nossa maneira de agir.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-10 md:mb-16">
      {Object.values(DISC_DEFINITIONS).map((def) => (
        <div key={def.letter} className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[3rem] shadow-sm border border-neutral-100 flex items-start gap-4 md:gap-8 hover:border-orange-200 transition-colors group">
          <div className="w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-neutral-100 group-hover:bg-orange-600 group-hover:text-white text-neutral-400 flex items-center justify-center text-xl md:text-3xl font-black flex-shrink-0 transition-all">
            {def.letter}
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-black text-black leading-tight mb-1">{def.title}</h3>
            <p className="text-xs md:text-sm font-bold text-orange-600 uppercase mb-3 md:mb-4 tracking-widest">{def.meaning}</p>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {def.traits.map(trait => (
                <span key={trait} className="px-3 py-1 md:px-4 md:py-1.5 bg-neutral-50 rounded-lg text-[10px] md:text-xs font-black text-neutral-500 uppercase tracking-tight">
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="bg-orange-600 text-white p-8 md:p-16 rounded-[2.5rem] md:rounded-[4.5rem] text-center shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-10 opacity-10 scale-150 md:scale-200 rotate-12"><ChurchIcon /></div>
      <h3 className="text-2xl md:text-3xl font-black mb-4 md:mb-6 relative z-10">Pronto para sua autodescoberta?</h3>
      <p className="text-orange-100 mb-8 md:mb-10 text-base md:text-xl font-medium relative z-10">Insights profundos sobre sua vocação ministerial.</p>
      <button onClick={onStart} className="w-full sm:w-auto bg-white text-orange-600 font-black py-4 md:py-5 px-10 md:px-14 rounded-full transition-all hover:bg-black hover:text-white relative z-10 shadow-lg text-base md:text-lg">
        Fazer o Teste agora
      </button>
    </div>
  </div>
);

const QuestionStep: React.FC<{ 
  question: (typeof QUESTIONS)[0], 
  onAnswer: (p: ProfileType) => void | Promise<void>, 
  current: number, 
  total: number 
}> = ({ question, onAnswer, current, total }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelect = (idx: number, profile: ProfileType) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(idx);
    setTimeout(() => {
      onAnswer(profile);
    }, 400);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 md:py-16 px-4 md:px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 md:mb-14">
        <div className="flex justify-between items-end mb-4 md:mb-6">
          <div className="flex flex-col">
            <span className="text-xs md:text-sm font-black text-orange-600 uppercase tracking-[0.4em] mb-1">Questão</span>
            <span className="text-3xl md:text-5xl font-black text-black">{current} <span className="text-neutral-200 font-medium text-xl md:text-3xl">/ {total}</span></span>
          </div>
          <span className="text-xs md:text-base font-bold text-neutral-400 mb-1 md:mb-2 uppercase tracking-widest">{Math.round((current / total) * 100)}%</span>
        </div>
        <div className="w-full bg-neutral-100 h-2 md:h-3 rounded-full overflow-hidden shadow-inner">
          <div 
            className="bg-orange-600 h-full transition-all duration-700 ease-out"
            style={{ width: `${(current / total) * 100}%` }}
          />
        </div>
      </div>

      <h3 className="text-2xl md:text-5xl font-black text-black mb-8 md:mb-14 leading-tight tracking-tighter">
        {question.text}
      </h3>

      <div className="space-y-4 md:space-y-6">
        {question.options.map((option, idx) => {
          const isSelected = selectedIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx, option.profile)}
              className={`w-full text-left p-6 md:p-10 bg-white border-2 rounded-2xl md:rounded-[3rem] transition-all group flex items-center gap-4 md:gap-8 active:scale-[0.98] outline-none ${
                isSelected 
                  ? 'border-orange-600 bg-orange-50/50' 
                  : 'border-neutral-100 hover:border-orange-200'
              }`}
            >
              <span className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-base md:text-lg font-black transition-all shadow-sm flex-shrink-0 ${
                isSelected 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-neutral-50 text-neutral-400 group-hover:bg-neutral-100'
              }`}>
                {String.fromCharCode(65 + idx)}
              </span>
              <span className={`text-lg md:text-2xl font-bold transition-colors leading-tight ${
                isSelected ? 'text-orange-900' : 'text-neutral-700 group-hover:text-black'
              }`}>
                {option.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const ResultDashboard = ({ result, analysis, profileImageUrl, onReset, userName }: { 
  result: AssessmentResult, 
  analysis: AIAnalysis | null, 
  profileImageUrl: string | null, 
  onReset: () => void,
  userName: string
}) => {
  const [downloadState, setDownloadState] = useState<'idle' | 'preparing' | 'success'>('idle');
  const [textSaveState, setTextSaveState] = useState<'idle' | 'saving' | 'success'>('idle');
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'info', visible: boolean }>({ message: '', type: 'info', visible: false });

  const chartData = useMemo(() => [
    { name: 'D', value: result.scores[ProfileType.DOMINANCE] },
    { name: 'I', value: result.scores[ProfileType.INFLUENCE] },
    { name: 'S', value: result.scores[ProfileType.STABILITY] },
    { name: 'C', value: result.scores[ProfileType.COMPLIANCE] },
  ], [result]);

  const topThreeMinistries = useMemo(() => {
    if (!analysis) return [];
    return [...analysis.ministryFit].sort((a,b) => b.percentage - a.percentage).slice(0, 3);
  }, [analysis]);

  const showToast = (message: string, type: 'success' | 'info') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  const handlePrint = () => {
    if (downloadState !== 'idle') return;
    setDownloadState('preparing');
    showToast('Preparando seu relatório para impressão...', 'info');
    setTimeout(() => {
      window.print();
      setDownloadState('success');
      setTimeout(() => setDownloadState('idle'), 3000);
    }, 1000);
  };

  const handleDownloadText = useCallback(() => {
    if (!analysis || textSaveState !== 'idle') return;
    setTextSaveState('saving');
    showToast('Gerando arquivo de texto...', 'info');
    
    setTimeout(() => {
      const content = `
RELATÓRIO DE PERFIL COMPORTAMENTAL - EMB CHURCH
==================================================
CLIENTE: ${userName.toUpperCase()}
PERFIL PRINCIPAL: ${result.primary}
PERFIL SECUNDÁRIO: ${result.secondary || 'N/A'}

RESUMO:
${analysis.summary}

FORÇAS:
${analysis.strengths.map(s => `- ${s}`).join('\n')}

DESAFIOS:
${analysis.weaknesses.map(w => `- ${w}`).join('\n')}

TOP 3 MINISTÉRIOS:
${topThreeMinistries.map((m, i) => `${i + 1}. ${m.name} (${m.percentage}%): ${m.reason}`).join('\n')}

ESTILO DE COMUNICAÇÃO: ${analysis.communicationStyle}
ESTILO DE LIDERANÇA: ${analysis.leadershipStyle}
AMBIENTE IDEAL: ${analysis.idealEnvironment}

DICAS DE DESENVOLVIMENTO:
${analysis.careerTips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}
      `.trim();

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Relatorio_DISC_${userName.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setTextSaveState('success');
      showToast('Arquivo de texto gerado com sucesso!', 'success');
      setTimeout(() => setTextSaveState('idle'), 3000);
    }, 1200);
  }, [analysis, userName, result, topThreeMinistries, textSaveState]);

  return (
    <div className="max-w-6xl mx-auto py-8 md:py-16 px-4 md:px-6 animate-in fade-in duration-1000 pb-24">
      <Toast message={toast.message} type={toast.type} isVisible={toast.visible} />
      
      <div className="text-center mb-10 md:mb-16 print:mb-8">
        <h2 className="text-xs md:text-base font-black text-orange-600 uppercase tracking-[0.5em] mb-2 md:mb-4">Relatório EMB Church</h2>
        <h3 className="text-xl md:text-3xl font-black text-neutral-400 mb-1 md:mb-2 tracking-tighter">Personalizado para</h3>
        <h3 className="text-4xl md:text-9xl font-black text-black mb-4 md:mb-6 tracking-tighter leading-none">
          {userName}
        </h3>
        <div className="flex flex-col items-center gap-3 md:gap-4">
          <span className="text-2xl md:text-5xl font-black text-orange-600 tracking-tight uppercase">
            Perfil: {result.primary}
          </span>
          {result.secondary && (
            <span className="text-sm md:text-xl font-black bg-neutral-100 text-neutral-500 px-6 md:px-12 py-3 md:py-5 rounded-full border border-neutral-200 uppercase tracking-[0.2em]">
              Tendência Secundária: {result.secondary}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-14 mb-10 md:mb-20">
        <div className="bg-white p-6 md:p-14 rounded-3xl md:rounded-[4.5rem] shadow-sm border border-neutral-100">
          <h4 className="text-2xl md:text-3xl font-black text-black mb-6 md:mb-10 flex items-center gap-3 uppercase tracking-tighter">
            <ChartPieIcon /> Mapa de Perfil
          </h4>
          <div className="h-[350px] md:h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#e5e5e5" strokeWidth={3} />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 18, mdFontSize: 24, fontWeight: 900, fill: '#171717' }} />
                <Radar name="Score" dataKey="value" stroke="#ea580c" fill="#ea580c" fillOpacity={0.4} strokeWidth={5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 md:p-14 rounded-3xl md:rounded-[4.5rem] shadow-sm border border-neutral-100 flex flex-col justify-between">
          <div>
            <h4 className="text-2xl md:text-3xl font-black text-black mb-4 md:mb-6 flex items-center gap-3 uppercase tracking-tighter">
              <span className="w-2 md:w-3 h-8 md:h-12 bg-orange-600 rounded-full"></span> Sua Essência
            </h4>
            <p className="text-neutral-800 text-2xl md:text-5xl italic font-black leading-tight mb-6 md:mb-10">
              "{PROFILE_DESCRIPTIONS[result.primary]}"
            </p>
          </div>
          <div className="rounded-2xl md:rounded-[3rem] overflow-hidden bg-neutral-50 aspect-square border-2 border-neutral-100 relative shadow-inner hidden sm:block">
            {profileImageUrl ? (
              <img src={profileImageUrl} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" alt="Perfil" />
            ) : (
              <div className="flex items-center justify-center h-full text-neutral-300">
                <span className="text-sm font-black uppercase tracking-widest animate-pulse">Gerando Visualização...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-neutral-900 text-white p-8 md:p-20 rounded-[2.5rem] md:rounded-[6rem] mb-12 md:mb-24">
        <h4 className="text-3xl md:text-6xl font-black mb-10 md:mb-16 uppercase tracking-tighter">O Alfabeto da sua Personalidade</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {[
            { l: 'D', t: 'Dominância', desc: 'Representa como você lida com desafios. Um D alto indica foco em resultados e rapidez. Variações sugerem maior cautela ou agressividade dependendo do estresse.', color: 'text-red-500' },
            { l: 'I', t: 'Influência', desc: 'Mede como você lida com pessoas. Um I alto sinaliza entusiasmo e persuasão. Variações podem mostrar alguém mais reservado ou extremamente sociável.', color: 'text-yellow-500' },
            { l: 'S', t: 'Estabilidade', desc: 'Foca na paciência e consistência. Um S alto busca harmonia e segurança. Variações indicam adaptabilidade ou resistência a mudanças bruscas.', color: 'text-green-500' },
            { l: 'C', t: 'Conformidade', desc: 'Analisa o apego a regras e qualidade. Um C alto preza por detalhes e precisão. Variações mostram maior ou menor flexibilidade com processos.', color: 'text-blue-500' }
          ].map(item => (
            <div key={item.l} className="bg-neutral-800 p-8 rounded-[2rem] border border-neutral-700">
              <span className={`text-5xl md:text-7xl font-black ${item.color} mb-4 block`}>{item.l}</span>
              <h5 className="text-xl md:text-2xl font-black mb-3 uppercase tracking-widest">{item.t}</h5>
              <p className="text-neutral-400 font-bold leading-relaxed text-sm md:text-lg">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {analysis ? (
        <div className="space-y-12 md:space-y-24">
          <div className="bg-black text-white p-8 md:p-20 rounded-[2.5rem] md:rounded-[6rem] relative overflow-hidden">
            <h4 className="text-3xl md:text-5xl font-black mb-8 md:mb-14 flex items-center gap-4 uppercase tracking-tighter">
              <LightBulbIcon /> Resumo Estratégico
            </h4>
            <p className="text-neutral-200 text-xl md:text-3xl leading-relaxed mb-10 md:mb-20 font-bold border-l-4 md:border-l-[12px] border-orange-600 pl-6 md:pl-16">
              {analysis.summary}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
              <div className="bg-neutral-900 p-8 md:p-14 rounded-3xl md:rounded-[4rem] border border-neutral-800">
                <h5 className="text-lg md:text-2xl font-black text-orange-600 uppercase mb-6 md:mb-10 tracking-[0.2em]">Principais Forças</h5>
                <ul className="space-y-4 md:space-y-8">
                  {analysis.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-4 md:gap-6 text-lg md:text-2xl font-bold text-white">
                      <span className="text-orange-600 font-black mt-1">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-neutral-900 p-8 md:p-14 rounded-3xl md:rounded-[4rem] border border-neutral-800">
                <h5 className="text-lg md:text-2xl font-black text-orange-400 uppercase mb-6 md:mb-10 tracking-[0.2em]">Pontos de Atenção</h5>
                <ul className="space-y-4 md:space-y-8">
                  {analysis.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-4 md:gap-6 text-lg md:text-2xl font-bold text-white">
                      <span className="text-orange-400 font-black mt-1">!</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 md:p-20 rounded-[2.5rem] md:rounded-[6rem] border border-neutral-100 shadow-sm">
            <h4 className="text-3xl md:text-6xl font-black text-black mb-10 md:mb-20 flex items-center gap-4 uppercase tracking-tighter">
              <HeartIcon /> Top 3 Ministérios Mais Assertivos
            </h4>
            <div className="space-y-12 md:space-y-20">
              {topThreeMinistries.map((ministry, index) => (
                <div key={ministry.name} className="relative group p-6 md:p-14 bg-neutral-50 rounded-[2rem] md:rounded-[4rem] border border-neutral-100 transition-all hover:bg-orange-50/30">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-6">
                      <span className="text-4xl md:text-7xl font-black text-orange-600 opacity-30">0{index + 1}</span>
                      <h5 className="text-2xl md:text-5xl font-black text-black tracking-tighter uppercase">{ministry.name}</h5>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xl md:text-3xl font-black text-orange-600">{ministry.percentage}% Afinidade</span>
                    </div>
                  </div>
                  <div className="w-full bg-neutral-200 h-3 md:h-6 rounded-full overflow-hidden mb-8 shadow-inner">
                    <div 
                      className="h-full bg-orange-600 transition-all duration-1000 ease-out"
                      style={{ width: `${ministry.percentage}%` }}
                    />
                  </div>
                  <p className="text-lg md:text-3xl text-neutral-600 font-bold leading-relaxed italic border-l-4 md:border-l-8 border-neutral-200 pl-6 md:pl-10">
                    {ministry.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-14">
            {[
              { label: "Comunicação", val: analysis.communicationStyle },
              { label: "Liderança", val: analysis.leadershipStyle },
              { label: "Ambiente Ideal", val: analysis.idealEnvironment }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-10 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border border-neutral-100 shadow-sm">
                <h5 className="text-sm md:text-lg font-black uppercase text-orange-600 mb-6 md:mb-10 tracking-[0.2em]">{item.label}</h5>
                <p className="text-xl md:text-3xl text-neutral-800 leading-tight font-black">{item.val}</p>
              </div>
            ))}
          </div>

          <div className="bg-neutral-50 p-8 md:p-24 rounded-[3rem] md:rounded-[7rem] border border-neutral-100">
            <h4 className="text-3xl md:text-6xl font-black text-black mb-12 md:mb-20 uppercase tracking-tighter">Plano de Desenvolvimento</h4>
            <div className="space-y-6 md:space-y-12">
              {analysis.careerTips.map((tip, i) => (
                <div key={i} className="flex gap-6 md:gap-14 p-8 md:p-16 bg-white rounded-[2rem] md:rounded-[4rem] border border-neutral-100 items-center shadow-sm">
                  <span className="w-14 h-14 md:w-24 md:h-24 bg-black text-white rounded-2xl md:rounded-[2.5rem] flex items-center justify-center font-black text-2xl md:text-5xl flex-shrink-0">{i + 1}</span>
                  <p className="text-xl md:text-4xl text-neutral-800 font-bold leading-tight">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8 md:space-y-12 pt-10 md:pt-20 print:hidden">
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 px-4">
               <button 
                 disabled={downloadState !== 'idle'}
                 onClick={handlePrint}
                 className="group w-full sm:w-auto bg-orange-600 text-white px-8 md:px-14 py-5 md:py-8 rounded-full font-black text-lg md:text-2xl flex items-center justify-center gap-4 shadow-2xl active:scale-95 transition-all hover:bg-black disabled:bg-neutral-400 disabled:cursor-not-allowed"
               >
                 {downloadState === 'preparing' ? <SpinnerIcon /> : <DownloadIcon />}
                 {downloadState === 'preparing' ? 'Preparando PDF...' : downloadState === 'success' ? 'PDF Gerado!' : 'Baixar PDF Completo'}
               </button>
               <button 
                 disabled={textSaveState !== 'idle'}
                 onClick={handleDownloadText}
                 className="group w-full sm:w-auto bg-neutral-900 text-white px-8 md:px-14 py-5 md:py-8 rounded-full font-black text-lg md:text-2xl flex items-center justify-center gap-4 shadow-xl active:scale-95 transition-all hover:bg-orange-600 disabled:bg-neutral-600 disabled:cursor-not-allowed"
               >
                 {textSaveState === 'saving' ? <SpinnerIcon /> : textSaveState === 'success' ? <CheckIcon /> : <FileTextIcon />}
                 {textSaveState === 'saving' ? 'Gerando Arquivo...' : textSaveState === 'success' ? 'Salvo!' : 'Salvar em Texto (.txt)'}
               </button>
            </div>

            <div className="flex justify-center pt-8">
              <button onClick={onReset} className="text-neutral-400 hover:text-orange-600 text-xl md:text-4xl font-black transition-all border-b-4 md:border-b-[10px] border-transparent hover:border-orange-600 pb-3 uppercase tracking-[0.3em] outline-none">
                Reiniciar Jornada
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-20 md:py-40 text-center animate-pulse">
          <div className="animate-spin rounded-full h-16 w-16 md:h-24 md:w-24 border-[6px] md:border-[10px] border-orange-100 border-t-orange-600 mb-8 md:mb-12"></div>
          <h4 className="text-2xl md:text-5xl font-black text-black mb-4 uppercase tracking-tighter">Analisando sua Essência Ministerial...</h4>
          <p className="text-xs md:text-xl text-neutral-400 font-black uppercase tracking-[0.4em]">Gerando inteligência comportamental profunda</p>
        </div>
      )}
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [step, setStep] = useState<'landing' | 'intro' | 'quiz' | 'results' | 'methodology'>('landing');
  const [showDiscModal, setShowDiscModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<ProfileType[]>([]);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    if (!userName.trim()) return;
    setStep('intro');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setAssessmentResult(null);
    setAiAnalysis(null);
    setProfileImageUrl(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (step === 'methodology' || step === 'intro') {
      setStep('landing');
    } else if (step === 'quiz') {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        setAnswers(prev => prev.slice(0, -1));
      } else {
        setStep('intro');
      }
    } else if (step === 'results') {
      setStep('landing');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswer = (profile: ProfileType) => {
    const newAnswers = [...answers, profile];
    setAnswers(newAnswers);

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setStep('results');
      processResults(newAnswers);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const processResults = async (finalAnswers: ProfileType[]) => {
    const scores: Record<ProfileType, number> = {
      [ProfileType.DOMINANCE]: 0,
      [ProfileType.INFLUENCE]: 0,
      [ProfileType.STABILITY]: 0,
      [ProfileType.COMPLIANCE]: 0,
    };
    finalAnswers.forEach(ans => scores[ans]++);
    const sortedProfiles = (Object.keys(scores) as ProfileType[]).sort((a, b) => scores[b] - scores[a]);
    const result: AssessmentResult = {
      scores,
      primary: sortedProfiles[0],
      secondary: scores[sortedProfiles[1]] > 0 ? sortedProfiles[1] : null,
    };
    setAssessmentResult(result);
    try {
      const [analysis, imageUrl] = await Promise.all([
        generateBehavioralAnalysis(result),
        generateProfileImage(result.primary, result.secondary)
      ]);
      setAiAnalysis(analysis);
      setProfileImageUrl(imageUrl);
    } catch (err) {
      setError("Houve um problema ao processar sua análise comportamental. Tente novamente em instantes.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden antialiased">
      <Header 
        setStep={setStep} 
        onBack={handleBack} 
        showBack={step !== 'landing'}
      />
      <DiscModal isOpen={showDiscModal} onClose={() => setShowDiscModal(false)} />
      
      <main className="pb-10 md:pb-24 print:pb-0">
        {step === 'landing' && (
          <LandingPage 
            onStart={handleStart} 
            onOpenDisc={() => setShowDiscModal(true)} 
            userName={userName} 
            setUserName={setUserName} 
          />
        )}
        {step === 'intro' && <IntroPage onContinue={() => setStep('quiz')} userName={userName} />}
        {step === 'methodology' && <MethodologySection onStart={handleStart} />}
        {step === 'quiz' && (
          <QuestionStep 
            key={currentQuestionIndex}
            question={QUESTIONS[currentQuestionIndex]} 
            onAnswer={handleAnswer} 
            current={currentQuestionIndex + 1} 
            total={QUESTIONS.length} 
          />
        )}
        {step === 'results' && assessmentResult && (
          <ResultDashboard 
            result={assessmentResult} 
            analysis={aiAnalysis} 
            profileImageUrl={profileImageUrl} 
            onReset={handleStart} 
            userName={userName} 
          />
        )}
        {error && <div className="max-w-4xl mx-auto mt-10 p-8 bg-red-50 border border-red-200 rounded-3xl text-red-700 text-center font-bold">{error}</div>}
      </main>
      <footer className="fixed bottom-0 w-full bg-white/95 backdrop-blur-md border-t border-neutral-100 py-4 text-center z-40 print:hidden">
         <p className="text-[10px] md:text-[12px] font-black text-neutral-400 uppercase tracking-[0.5em]">EMB Church • Perfil • 2024</p>
      </footer>
    </div>
  );
}

const BookIcon = () => (
  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
);
