'use client'
import { useEffect, useState } from "react";
import Question from './components/question';
import Congratulations from "./components/Congratulations";

interface Country {
  name: {
    common: string
  }
  capital: string[]
  flags: {
    png: string
    svg: string
  }
  region: string
}
interface QuestionData {
  id: string
  flag?: string
  question: string
  correctAnswer: string
  options: string[]
}

export default function Home() {

  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [countries, setCountries]= useState<Country[]>([]);
  const [disabledQuestions, setDisabledQuestions] = useState<{ [key: string]: boolean }>({});
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [score, setScore] = useState(0);
  const [ fullScore, setFullScore] = useState(0);
  
  const fetchCountry = async () => {
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name,capital,flags,region");
    const data = await response.json();
    setCountries(data);
  }

  useEffect(()=>{
     fetchCountry();
  },[])

  useEffect(()=>{
     if (countries.length > 0){
       const newQuestions = [...Array(10)].map((_,index)=> (
       { id: index.toString(),
        ...generateQuestion(countries)
      }))
      setQuestions(newQuestions);
      setCurrentQuestion(0)
     }
  },[countries])

  const questionTypes = [
    { type: "capital", question: "What is the capital of" },
    { type: "flag", question: "Which country does this flag belong to?" },
    { type: "region", question: "Which region is" },
  ]

  //mezclar las opciones de respuesta
  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }
  
  const generateQuestion = (country: Country[]) => {
    const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    const randomCountry = country[Math.floor(Math.random() * country.length)];

    let question: string;
    let correctAnswer: string;
    let options: string[];
    let flag: string = '';

    switch (randomType.type) {
      case "capital":
        question = `${randomType.question} ${randomCountry.name.common}?`
        correctAnswer = randomCountry.capital[0]
        options = shuffleArray([
          ...countries
            .filter((c) => c.name.common !== randomCountry.name.common)
            .map((c) => c.capital[0])
            .filter(Boolean)
            .slice(0, 3),
          correctAnswer,
        ])
        break
      case "flag":
        flag = randomCountry.flags.png
        question = randomType.question
        correctAnswer = randomCountry.name.common
        options = shuffleArray([
          ...countries
            .filter((c) => c.name.common !== randomCountry.name.common)
            .map((c) => c.name.common)
            .slice(0, 3),
          correctAnswer,
        ])
        break
      case "region":
        question = `${randomType.question} ${randomCountry.name.common} located in?`
        correctAnswer = randomCountry.region
        options = shuffleArray(
          [...new Set(countries.map((c) => c.region).filter((r) => r !== randomCountry.region))]
            .slice(0, 3)
            .concat(correctAnswer),
        )
        break
      default:
        throw new Error("Invalid question type")
    }
    return { question, correctAnswer, options, flag }
  }

  const handleAnswer = (answer: string) => {
    setFullScore((prev)=>prev +1)
    const questionActive = questions[currentQuestion]
    setDisabledQuestions((prev) => ({
      ...prev,
      [questionActive.id]: true,
    }))
    setUserAnswers((prev) => ({
      ...prev,
      [questionActive.id]: answer, // Guarda la respuesta para la pregunta específica
    }));
    
    if (answer == questionActive.correctAnswer ) {
       setScore((prev) => prev + 1);
    }else{
      console.log('incorrecta');
      
    }
   
  };
  const handlePlayAgain = ()=>{
    setFullScore(0)
    setScore(0)
    setUserAnswers({})
    setDisabledQuestions({})
    setCurrentQuestion(0)
  }
 const questionActive = questions[currentQuestion];
  return (
    <div className=" flex flex-col items-center justify-center h-screen">

      {fullScore === 10 ? (
        <>
        <Congratulations correctAnswers={score} handlePlayAgain={handlePlayAgain} />
        </>
      ) : (
        <div className="flex flex-col w-[80%] md:w-[70%]  ">
        <div className=" flex justify-between w-full items-center  pb-2">
          <p>Country Quiz</p>
          <div className=" rounded-xl p-1 bg-gradient-to-r from-[#E65895] to-[#BC6BE8] px-4 ">
            <p>{score}/10 Points</p>
          </div>
        </div>
        <div className=" bg-[#393F6E] bg-opacity-45 w-full p-4 rounded-xl mt-4 md:py-20 md:px-32 ">
          <div className=" flex justify-between " >
          {[...Array(10)].map((_, index) => (
            <button
              key={index} 
              className={`rounded-full bg-[#393F6E] text-white p-2 m-1 flex justify-center items-center w-[40px] ${ currentQuestion >= index  ? ' bg-gradient-to-r from-[#E65895] to-[#BC6BE8]':'' } `}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </button>
          ))}
           
          </div>
          {questions.length > 0 && questionActive && (
            <Question
              question2={questionActive}
              isDisabled={disabledQuestions[questionActive.id] || false}
              handleAnswer={handleAnswer}
              questionId={questionActive.id}
              userAnswers={userAnswers[questionActive.id]}
            />
          )}
        </div>
      </div>
        
      ) }
      
      
    </div>
  );
}
