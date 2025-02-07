

interface CongratulationsProps {
    handlePlayAgain: ( ) => void;
    correctAnswers: number;
  }
export default function Congratulations({handlePlayAgain,correctAnswers }: CongratulationsProps ){
   return (
      <div className=" bg-[#393F6E] bg-opacity-45 rounded-md text-center p-8 w-[80%] md:w-[30%] ">
        <div>
            <img src="/congrats.png" alt="" className=" w-[100%]" />
        </div>
        <div>
            <h1 className=" my-2 text-3xl font-bold md:mt-4 " >Congrats! You Completed the quiz </h1>
            <p className=" font-semibold text-lg mt-5 " > You answere {correctAnswers} / 10 correctly </p>
            <button onClick={handlePlayAgain} className=" p-4 px-8 rounded-lg mt-10 bg-gradient-to-r from-[#E65895] to-[#BC6BE8] font-bold " > Play Again</button>
        </div>
      </div>
     
   )
}