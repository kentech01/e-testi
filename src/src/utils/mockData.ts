import { Question, Subject } from '../types/exam';

// Import Figma assets
import mathQuestionsImage from 'figma:asset/ab2130238c669774c9a7337397996b6a3345926a.png';
import housePlanImage from 'figma:asset/41570a0bbce5ad5706abf665a800b572a24ee738.png';

const createBaseQuestions = (subject: Subject): Question[] => {
  const questions: { [key: string]: Question[] } = {
    matematik: [
      {
        id: 101,
        question: "Për transportimin e një sasie të thëngjellit nevojiten 24 kamionë me fuqi transportuese 14 tonëshe. Sa kamionë me fuqi bartëse 12 tonëshe do të ishin të nevojshëm për transportimin e sasisë së njëjtë të thëngjellit?",
        options: ["22", "24", "28", "30"],
        correctAnswer: 2,
        subject: "matematik"
      },
      {
        id: 102,
        question: "Sa është vlera e shprehjes (-a²)⁴ · (-a⁻)² : a ?",
        options: ["-a²", "a¹¹", "a⁶", "-a¹¹"],
        correctAnswer: 1,
        subject: "matematik"
      },
      {
        id: 103,
        question: "Cili funksion i përgjigjet grafikut të dhënë?",
        options: ["y = x² + 4x", "y = x² - 4x", "y = -x² - 4x", "y = -x² + 4x"],
        correctAnswer: 3,
        subject: "matematik",
        hasInteractiveGraph: true,
        graphConfig: {
          functionType: 'quadratic',
          coefficients: { a: -1, b: 4, c: 0 },
          domain: { x: [-2, 6], y: [-2, 6] }
        }
      },
    ],
    gjuhaShqipe: [
      {
        id: 30,
        question: "Nga personazhet dhe elementet e tjera mund të kuptohet se ky fragment është nxjerrë nga legjenda shqiptare e njohur si legjenda e:",
        options: ["ringjalljes", "rinjohjjes", "murosjes", "vëllavrasjes"],
        correctAnswer: 2,
        subject: "gjuhaShqipe",
        readingPassage: `Kam parë shtëpinë të nxirë e të shembur, ku unë kam lindur, ku u kam lindur edhe ti, o Gjergj! Edhe kam marrë dhé prej atje, edhe ja kam sjellë me vete, se do të të hedhë në varr bashkë me ty, që të mos harrojmë tokën tonë edhe as në vdekje.`,
        passageId: "legjenda1",
        passageTitle: "Fragment nga legjenda shqiptare e murosjes",
        questionNumber: 1,
        totalPassageQuestions: 5
      },
    ],
    anglisht: [
      {
        id: 80,
        question: "According to the house plan shown, which room has the largest area?",
        options: ["Living room", "Parents' bedroom", "Kitchen", "David's bedroom"],
        correctAnswer: 0,
        subject: "anglisht",
        readingPassage: `David lives in a spacious house with his parents. Below is the house plan.`,
        imageUrl: housePlanImage,
        imageCaption: "David's house floor plan showing room dimensions",
        passageId: "house_plan1",
        passageTitle: "David's House Plan",
        questionNumber: 1,
        totalPassageQuestions: 3
      },
    ]
  };

  return questions[subject] || [];
};

export const generateMockQuestions = (subject: Subject): Question[] => {
  const baseQuestions = createBaseQuestions(subject);
  const additionalQuestionsCount = 100 - baseQuestions.length;
  const startId = Math.max(...baseQuestions.map(q => q.id)) + 1;
  
  const additionalQuestions: Question[] = [];
  
  for (let i = 0; i < additionalQuestionsCount; i++) {
    const shouldHaveImage = Math.random() < 0.08;
    const shouldHaveGraph = subject === 'matematik' && Math.random() < 0.15;
    
    additionalQuestions.push({
      id: startId + i,
      question: `${subject === 'matematik' ? 'Pyetja matematike' : subject === 'gjuhaShqipe' ? 'Pyetja e gjuhës shqipe' : 'English question'} ${startId + i}: Zgjidhni përgjigjen e saktë për këtë pyetje të simuluar.`,
      options: ["Opsioni A", "Opsioni B", "Opsioni C", "Opsioni D"],
      correctAnswer: Math.floor(Math.random() * 4),
      subject,
      ...(shouldHaveImage && {
        imageUrl: "https://images.unsplash.com/photo-1727522974735-44251dfe61b3?w=400&q=80",
        imageCaption: "Diagram ilustrues për pyetjen"
      }),
      ...(shouldHaveGraph && {
        hasInteractiveGraph: true,
        graphConfig: {
          functionType: ['quadratic', 'linear', 'exponential'][Math.floor(Math.random() * 3)] as any,
          coefficients: { 
            a: Math.floor(Math.random() * 5) + 1, 
            b: Math.floor(Math.random() * 5) - 2, 
            c: Math.floor(Math.random() * 5) - 2 
          },
          domain: { x: [-5, 5], y: [-10, 10] }
        }
      })
    });
  }
  
  return [...baseQuestions, ...additionalQuestions];
};