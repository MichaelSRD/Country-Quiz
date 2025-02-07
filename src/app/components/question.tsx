'use client'

interface QuestionProps {
  question2: {
      flag?: string
      question: string
      correctAnswer: string
      options: string[]
  };
  handleAnswer: (answer: string) => void;
  isDisabled: boolean;
  questionId: string;
  userAnswers: string ;
}



export default function Question({ question2, handleAnswer, isDisabled, questionId, userAnswers}: QuestionProps) {
 
  if (!question2) {
    return <p>Loading.....</p>;
  }
  return (
    <>
    <p className=" text-center py-4  " > {question2.question}</p>
    <div className="flex justify-center items-center mb-4">
    {question2.question.includes('flag') && (
      <div className=" w-[70px] h-[50px]">
        <img src={question2.flag} alt="Countri flag" className=" w-[100%] h-[100%]" />
    </div>
       )  }
    </div>
    <div className=" space-y-2 md:grid md:grid-cols-2 md:gap-4  md:space-y-0 md:w-[80%] md:justify-self-center ">
      {question2.options.map((option,index)=>(
        <button key={
          `${questionId}-${index}`
        } className={` cursor-pointer ${userAnswers ? '':'hover:bg-gradient-to-r from-[#E65895] to-[#BC6BE8]' } bg-[#393F6E] w-full text-center p-3 rounded-md  ${ userAnswers == option ? 'bg-gradient-to-r from-[#E65895] to-[#BC6BE8]':'' }  `} onClick={()=>{ handleAnswer(option)
        }} disabled={isDisabled} >{option} { userAnswers == option && (question2.correctAnswer == option ? '✔️' : '❌') } 
        {userAnswers && userAnswers !== option && question2.correctAnswer === option && '✔️' }
        </button>
      )) }
    </div>
    </>
  );
}