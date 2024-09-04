import React from "react";
import parse from "html-react-parser";
import _, { result } from "lodash";
import StartPage from "./components/StartPage";

export default function App() {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [answerMap, setAnswerMap] = React.useState([]); // to put suffle array into list
  const [userSelection, setUserSelection] = React.useState({});  // to select option
  const [results, setResults] = React.useState(null);
  const [score, setScore] = React.useState(null);
  const [showAllAnswer, setShowAllAnswer] = React.useState(false);  // to show all right answer
  const [isQuizCompleted, setIsQuizCompleted] = React.useState(false); // stop selection after completion

  const getData = async () => {
    setLoading(true);  // showing load page before data goes into state & stop after setLoading(false)
    try {
      const res = await fetch("https://opentdb.com/api.php?amount=5");
      const result = await res.json();
      setData(result.results);
      setIsQuizCompleted(false)   // Reset quiz completion state when new data is fetched
    } catch (error) {
      console.error("Error detected:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (data) {
      const newAnswerMap = data.map((item) => {
        const allAnswers = [...item.incorrect_answers, item.correct_answer];
        return _.shuffle(allAnswers);
      });
      setAnswerMap(newAnswerMap); // put suffled answer into  array.
    }
  }, [data]);

  function handleSelectedAnswer(questionIndex, selectedAnswer) {
    if(isQuizCompleted) return;  // Prevent selection if quiz is completed
    setUserSelection((prevSelection) => {
      if (prevSelection[questionIndex] === selectedAnswer) {  // to remove prev selection
        const { [questionIndex]: _, ...restSelections } = prevSelection;
        return restSelections;
      }

      return { ...prevSelection, [questionIndex]: selectedAnswer };  // to select
    });
  }

  const checkScore = () => {
    if (!data) return;

    const result = data.map((item, index) => {
      return {
        question: parse(item.question),
        correctAnswer: item.correct_answer,
        userAnswer: userSelection[index] || "None",
        isCorrect: userSelection[index] === item.correct_answer,
      };
    });

    const correctCount = result.filter((rst) => rst.isCorrect).length;
    setResults(result);
    setScore(`${correctCount}/${data.length}`);
    setShowAllAnswer(true);     // will show all answer
    setIsQuizCompleted(true);  //mark Quiz as completed . so stop choosing option
  };

  return (
    <div className="app">
      {loading ? (
        <p className="loading">Loading...</p>
      ) : data ? (
        <div className="app-data">
          {data.map((item, index) => {
            const answers = answerMap[index] || [];
            const selectedAnswer = userSelection[index];
            const isLastItem = index === data.length - 1;  // for hr tag border

            return (
              <div key={index} className="app-content">
                <p className="quiz-question">
                  Q.{index + 1} {parse(item.question)}
                </p>
                <ul>
                  {answers.map((answer, ansId) => {
                    const isCorrectAnswer = item.correct_answer === answer;
                    const isSelected = selectedAnswer === answer;

                    // Apply conditional styling
                    const backgroundColor = showAllAnswer
                      ? isCorrectAnswer
                        ? "#4CAF50" // Green for correct answers
                        : isSelected && !isCorrectAnswer
                        ? "#F44336" // Red for incorrect selected answers
                        : "#fff"
                      : isSelected
                      ? "#4CAF50" // Green for currently selected answers
                      : "#fff";

                    const color = showAllAnswer
                      ? isCorrectAnswer
                        ? "#fff" // White text for correct answers
                        : isSelected
                        ? "#fff" // White text for incorrect selected answers
                        : "#3468eb" // Default color for other answers
                      : isSelected
                      ? "#fff" // White text for selected answers
                      : "#3468eb";
                    


                    return (
                      <li
                        key={`${index}-${ansId}`}
                        onClick={() => handleSelectedAnswer(index, answer)}
                        className="list--answers"
                        style={{
                          backgroundColor: backgroundColor,
                          color: color,
                          boxShadow: isSelected
                            ? "0px 4px 8px rgba(0, 0, 0, 0.2)"
                            : "none",
                          transition: "background-color 0.3s, color 0.3s",
                        }}
                      >
                        {parse(answer)}
                      </li>
                    );
                  })}
                </ul>

                {!isLastItem && <hr className="hr-border" />}
              </div>
            );
          })}
          <div className="result">
            {results ? (
              <div className="result-content">
                <p>Your Score is {score}</p>
                <button
                  onClick={() => {
                    setResults(null);
                    setShowAllAnswer(false);
                    setUserSelection({});
                    getData();
                  }}
                >
                  Restart Quiz
                </button>
              </div>
            ) : (
              <button onClick={checkScore} className="checkBtn">
                Check Score
              </button>
            )}
          </div>
        </div>
      ) : (
        <StartPage getData={getData} />
      )}
    </div>
  );
}


