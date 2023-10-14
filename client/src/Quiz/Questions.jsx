import React, { useEffect, useState } from 'react';
import Timer from './Timer';
import axios from 'axios'
import { useAsyncError } from 'react-router-dom';

function Questions() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [error, setError] = useState('');
  const [Answer, setAnswer] = useState();
  const [options,setOptions] = useState([]);
  const [question,setQuestion] = useState()
  const [id,setId] = useState()
  const [video,setVideo] = useState()

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setError(''); 
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedOption) {
      setAnswer(selectedOption);
    }else{
      setError('Please select an option')
    }
  };

  useEffect(()=>{
    getQuestion()
  },[])

  const getQuestion = async() =>{
      const response = await axios.get('http://localhost:8080/api/getQuestion');
      const { options, correctAnswer, _id } = response.data;

      // Create the optionArray
      const optionArray = [options[0], options[1], correctAnswer, options[2]];
      // Shuffle the optionArray using the Fisher-Yates algorithm
      for (let i = optionArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optionArray[i], optionArray[j]] = [optionArray[j], optionArray[i]];
      }
      setOptions(optionArray)
      setQuestion(response.data.question)
      setVideo(response.data.video)
      setId(_id)
  }




  return (
    <>
    {

      question ? 
      <>
      {
        video &&
        <div className="flex justify-center bg-gray-100 py-12">
        <div className="w-2/4 bg-white p-4 shadow-md rounded-lg">
          <video
            className="w-full h-auto rounded-lg"
            controls
            controlsList="nodownload nofullscreen"
            loop
            autoPlay 
            src={video}
            type="video/mp4"
          />
        </div>
      </div>
      
      }


      <Timer selectedOption={Answer} quizId={id}/>
      <div className="max-w-lg mx-auto mt-8">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="text-xl font-semibold mb-4">{question}</div>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div className="flex items-center space-x-2" key={index}>
                  <input
                    type="radio"
                    id={`option${index}`}
                    name="color"
                    value={option}
                    checked={selectedOption === option}
                    onChange={() => handleOptionSelect(option)}
                    className="form-radio text-indigo-600"
                  />
                  <label htmlFor={`option${index}`} className="text-gray-800"> {option}</label>
                </div>
              ))}
            </div>
            {error && (
              <p className="text-red-600 text-sm mt-2">{error}</p>
            )}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-4"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      </>
      :
      <div className="flex justify-center bg-gray-100 py-12">
      <div className="w-2/4 bg-white p-4 shadow-md rounded-lg">
        No Quiz Available  
      </div>
    </div>
    }
    </>
  );
}

export default Questions;
