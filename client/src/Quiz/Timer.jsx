import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';

function Timer({selectedOption,quizId}) {
  const [time, setTime] = useState({ seconds: 0, milliseconds: 0 });
  const [isActive, setIsActive] = useState(true);

  const location = useLocation()

  const navigate = useNavigate()


  useEffect(()=>{
    if(selectedOption){
      stopTimer(selectedOption)
    }
  },[selectedOption])

  useEffect(() => {
    let interval;

    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newMilliseconds = prevTime.milliseconds + 10;
          if (newMilliseconds >= 1000) {
            return { seconds: prevTime.seconds + 1, milliseconds: 0 };
          }
          return { ...prevTime, milliseconds: newMilliseconds };
        }, 10);
      });
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isActive, time.seconds]);

  const stopTimer = async(selectedOption) => {
    setIsActive(false);
    const fullName = await location.state
    const accurateTime = parseInt(`${time.seconds}${time.milliseconds}`)
    const response  = await axios.post('http://localhost:8080/api/submitAnswer',{selectedOption,accurateTime,fullName,quizId}).catch((error)=>toast.error(error.response.data.message))
    if(response) toast.success(response.data.message)
    console.log('first')
    navigate('/topPlayers',{state:quizId})
  };


  return (
    <div className="w-64 mx-auto mt-8">
      <div className="text-4xl mb-2">
        Time: {time.seconds}.{time.milliseconds}
      </div>
    </div>
  );
}

export default Timer;
