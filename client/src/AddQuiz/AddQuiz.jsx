import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast';


function AddQuiz() {
  const location = useLocation();
  const [fullName, setFullName] = useState(location.state);

  const [video, setVideo] = useState(null);
  const [question, setQuestion] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [options, setOptions] = useState(['', '', '']);
  const [videoError, setVideoError] = useState('');
  const [questionError, setQuestionError] = useState('');
  const [correctAnswerError, setCorrectAnswerError] = useState('');
  const [optionsError, setOptionsError] = useState(['', '', '']);

  // Function to handle file upload and validate video duration
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    setVideoError(''); // Reset any previous error messages

    if (file) {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        const duration = video.duration;
        if (duration > 600) { // 600 seconds (10 minutes)
          setVideoError('Video duration must be under 10 minutes.');
          setVideo(null); // Clear the video if it exceeds the duration limit
        } else {
          setVideo(file);
        }
      };
    }
  };


  const handleSubmit =  async () => {
    // Reset previous errors
    setVideoError('');
    setQuestionError('');
    setCorrectAnswerError('');
    setOptionsError(['', '', '']);

    let hasErrors = false;

    // Validate video
    if (!video) {
      setVideoError('Please upload a video.');
      hasErrors = true;
    }

    // Validate question
    if (question.trim() === '') {
      setQuestionError('Question is required.');
      hasErrors = true;
    }

    // Validate correct answer
    if (correctAnswer.trim() === '') {
      setCorrectAnswerError('Correct Answer is required.');
      hasErrors = true;
    }

    // Validate options
    const newOptionsError = [...options].map((option, index) => {
      if (option.trim() === '') {
        hasErrors = true;
        return 'Option is required.';
      }
      return '';
    });
    setOptionsError(newOptionsError);

    if (hasErrors) {
      return;
    }

    toast.loading('Uploading Question')
    const formData = new FormData();
    formData.append('video', video);
    formData.append('fullName', fullName);
    formData.append('correctAnswer', correctAnswer);
    formData.append('question',question)
    options.forEach((option, index) => {
      formData.append(`options[${index}]`, option);
    });

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    const response = await axios.post('http://localhost:8080/api/addQuiz', formData, config).then((response)=>{
      toast.dismiss()
      toast.success(response.data.msg)
    }).catch((error)=>{
      toast.dismiss()
      toast.error(error.response.data.msg)
    })

    setVideo(null);
    setQuestion('');
    setCorrectAnswer('');
    setOptions(['', '', '']);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-lg p-8 shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {fullName && `Hey 👋 ${fullName}`}
        </h1>

        {/* Styled video upload button with video preview */}
        <div className="mt-6">
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="hidden"
            id="video-upload"
          />
          <label
            htmlFor="video-upload"
            className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600 transition"
          >
            Upload Video
          </label>
          {video && (
            <div className="mt-4">
              <video className="w-full" controls>
                <source src={URL.createObjectURL(video)} type="video/mp4" />
              </video>
            </div>
          )}
          <div className="mt-4">
            {videoError && <div className="text-red-500">{videoError}</div>}
          </div>
        </div>

        {/* Box to add a question */}
        <div className="mt-8">
          <label className="text-lg font-semibold">Question:</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-4 border rounded-lg mt-2 focus:ring focus:ring-blue-400"
            rows="4"
          />
          <div className="mt-4">
            {questionError && <div className="text-red-500">{questionError}</div>}
          </div>
        </div>

        {/* Box for the correct answer */}
        <div className="mt-4">
          <label className="text-lg font-semibold">Correct Answer:</label>
          <input
            type="text"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            className="w-full p-4 border rounded-lg mt-2 focus:ring focus:ring-blue-400"
          />
          <div className="mt-4">
            {correctAnswerError && (
              <div className="text-red-500">{correctAnswerError}</div>
            )}
          </div>
        </div>

        {/* Box for additional options */}
        <div className="mt-4">
          <label className="text-lg font-semibold">Options:</label>
          {options.map((option, index) => (
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                setOptions(newOptions);
              }}
              className="w-full p-4 border rounded-lg mt-2 focus:ring focus:ring-blue-400"
            />
          ))}
          <div className="mt-4">
          {optionsError && (
              <div className="text-red-500">All Options are required</div>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600 transition"
          >
            Upload Quiz to Server
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddQuiz;
