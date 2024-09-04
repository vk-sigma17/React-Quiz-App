import React from 'react'

function StartPage(props) {
  return (
    <div className='quiz-start'>
        <p>Click below to start the quiz.</p>
        <button onClick={props.getData}>Start Quiz</button>
    </div>
  )
}

export default StartPage