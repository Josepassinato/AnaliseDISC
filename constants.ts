
import { ProfileType, Question } from './types';

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Em um projeto de equipe, qual é a sua principal tendência?",
    options: [
      { text: "Assumir o comando e focar nos resultados rápidos.", profile: ProfileType.DOMINANCE },
      { text: "Motivar as pessoas e manter o clima entusiasmado.", profile: ProfileType.INFLUENCE },
      { text: "Apoiar os colegas e garantir que todos estejam confortáveis.", profile: ProfileType.STABILITY },
      { text: "Analisar os processos e garantir que tudo esteja correto.", profile: ProfileType.COMPLIANCE }
    ]
  },
  {
    id: 2,
    text: "Como você lida com mudanças inesperadas?",
    options: [
      { text: "Vejo como uma oportunidade de agir e vencer desafios.", profile: ProfileType.DOMINANCE },
      { text: "Fico animado com as novas possibilidades sociais.", profile: ProfileType.INFLUENCE },
      { text: "Prefiro um tempo para processar e manter a segurança.", profile: ProfileType.STABILITY },
      { text: "Analiso detalhadamente os riscos envolvidos.", profile: ProfileType.COMPLIANCE }
    ]
  },
  {
    id: 3,
    text: "Qual destas palavras melhor descreve você no trabalho?",
    options: [
      { text: "Competitivo e focado.", profile: ProfileType.DOMINANCE },
      { text: "Comunicativo e persuasivo.", profile: ProfileType.INFLUENCE },
      { text: "Paciente e leal.", profile: ProfileType.STABILITY },
      { text: "Preciso e cauteloso.", profile: ProfileType.COMPLIANCE }
    ]
  },
  {
    id: 4,
    text: "O que mais te motiva em uma tarefa?",
    options: [
      { text: "Vencer obstáculos e alcançar o topo.", profile: ProfileType.DOMINANCE },
      { text: "Reconhecimento social e aplausos.", profile: ProfileType.INFLUENCE },
      { text: "Harmonia no grupo e previsibilidade.", profile: ProfileType.STABILITY },
      { text: "A perfeição técnica e a lógica dos fatos.", profile: ProfileType.COMPLIANCE }
    ]
  },
  {
    id: 5,
    text: "Quando sob pressão extrema, você tende a:",
    options: [
      { text: "Tornar-se agressivo ou impaciente para resolver logo.", profile: ProfileType.DOMINANCE },
      { text: "Tentar convencer os outros através do otimismo excessivo.", profile: ProfileType.INFLUENCE },
      { text: "Tornar-se hesitante ou buscar refúgio na rotina.", profile: ProfileType.STABILITY },
      { text: "Isolar-se para revisar minuciosamente os dados.", profile: ProfileType.COMPLIANCE }
    ]
  },
  {
    id: 6,
    text: "Como você prefere se comunicar?",
    options: [
      { text: "Direto ao ponto, sem rodeios.", profile: ProfileType.DOMINANCE },
      { text: "De forma calorosa, contando histórias e exemplos.", profile: ProfileType.INFLUENCE },
      { text: "Ouvindo mais do que falando, de forma empática.", profile: ProfileType.STABILITY },
      { text: "Por escrito, com dados e evidências claras.", profile: ProfileType.COMPLIANCE }
    ]
  },
  {
    id: 7,
    text: "Qual é o seu maior medo profissional?",
    options: [
      { text: "Perder o controle ou falhar nos objetivos.", profile: ProfileType.DOMINANCE },
      { text: "Ser rejeitado socialmente ou ignorado.", profile: ProfileType.INFLUENCE },
      { text: "Mudanças bruscas ou conflitos interpessoais.", profile: ProfileType.STABILITY },
      { text: "Cometer erros técnicos ou ser criticado pelo trabalho.", profile: ProfileType.COMPLIANCE }
    ]
  },
  {
    id: 8,
    text: "Ao planejar uma viagem, você:",
    options: [
      { text: "Define os destinos principais e vai ajustando no caminho.", profile: ProfileType.DOMINANCE },
      { text: "Busca lugares onde possa conhecer pessoas e se divertir.", profile: ProfileType.INFLUENCE },
      { text: "Planeja com antecedência para evitar sustos.", profile: ProfileType.STABILITY },
      { text: "Cria um roteiro detalhado com horários e custos.", profile: ProfileType.COMPLIANCE }
    ]
  },
  {
    id: 9,
    text: "Em uma reunião, você costuma:",
    options: [
      { text: "Interromper para focar no que é essencial.", profile: ProfileType.DOMINANCE },
      { text: "Ser quem puxa os assuntos e gera novas ideias.", profile: ProfileType.INFLUENCE },
      { text: "Aguardar o consenso do grupo antes de opinar.", profile: ProfileType.STABILITY },
      { text: "Anotar tudo e questionar a lógica dos argumentos.", profile: ProfileType.COMPLIANCE }
    ]
  },
  {
    id: 10,
    text: "Sua mesa de trabalho geralmente está:",
    options: [
      { text: "Um pouco bagunçada, mas funcional para metas rápidas.", profile: ProfileType.DOMINANCE },
      { text: "Cheia de fotos, recados e itens pessoais.", profile: ProfileType.INFLUENCE },
      { text: "Organizada e acolhedora.", profile: ProfileType.STABILITY },
      { text: "Impecavelmente organizada e sem distrações.", profile: ProfileType.COMPLIANCE }
    ]
  }
];

export const PROFILE_DESCRIPTIONS = {
  [ProfileType.DOMINANCE]: "Pessoas com perfil de Dominância são diretas, decididas e focadas em resultados. Elas amam desafios e não têm medo de assumir riscos para alcançar seus objetivos.",
  [ProfileType.INFLUENCE]: "Pessoas Influentes são entusiastas, otimistas e excelentes comunicadoras. Elas valorizam a conexão humana e têm facilidade em persuadir e motivar os outros.",
  [ProfileType.STABILITY]: "Pessoas com perfil de Estabilidade são calmas, confiáveis e ótimas ouvintes. Elas valorizam a segurança, a lealdade e preferem ambientes previsíveis e harmoniosos.",
  [ProfileType.COMPLIANCE]: "Pessoas com perfil de Conformidade são detalhistas, analíticas e sistemáticas. Elas prezam pela qualidade, pela lógica e pelo cumprimento rigoroso de regras e processos."
};

export const DISC_DEFINITIONS = {
  [ProfileType.DOMINANCE]: {
    letter: "D",
    title: "Dominância",
    meaning: "Como você lida com problemas e desafios.",
    traits: ["Decidido", "Competitivo", "Focado em Resultados", "Direto"]
  },
  [ProfileType.INFLUENCE]: {
    letter: "I",
    title: "Influência",
    meaning: "Como você lida com pessoas e as influencia.",
    traits: ["Entusiasta", "Persuasivo", "Sociável", "Otimista"]
  },
  [ProfileType.STABILITY]: {
    letter: "S",
    title: "Estabilidade",
    meaning: "Como você lida com o ritmo e a consistência.",
    traits: ["Paciente", "Leal", "Calmo", "Bom Ouvinte"]
  },
  [ProfileType.COMPLIANCE]: {
    letter: "C",
    title: "Conformidade",
    meaning: "Como você lida com regras e procedimentos.",
    traits: ["Preciso", "Analítico", "Sistemático", "Diplomático"]
  }
};
