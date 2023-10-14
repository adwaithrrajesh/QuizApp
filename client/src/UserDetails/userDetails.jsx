import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function UserDetails(){

 const [fullName,setFullName] = useState(null)
 const [error,setError] = useState(false)

 const navigate = useNavigate()

 const onSubmit = () =>{
  if(fullName){
    navigate('/takeQuiz',{state:fullName})
  }else{
    setError('Please Enter your Full Name')
  }
 }

 const addQuiz = () =>{
  if(fullName){
    navigate('/addQuiz',{state:fullName})
  }else{
    setError('Please Enter your Full Name')
  }
 }


  return (
    <div class="flex items-center justify-center h-screen">
  <div class="rounded-lg p-28 bg-blue-200 flex flex-col items-center">
    <div class="relative">
      <input
        type="text"
        placeholder="Full Name"
        onChange={(e)=>setFullName(e.target.value)}
        class="w-64 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring focus:border-blue-500"
      />
      {
        error &&  <p className="text-red-600 text-sm mt-2">{error}</p>
      }
    </div>
    <button class="mt-10 bg-blue-500 text-white py-2 px-4 rounded-full focus:outline-none hover:bg-blue-600" onClick={onSubmit}>
      Attend Quiz
    </button>

    <button class="mt-3 bg-blue-500 text-white py-2 px-4 rounded-full focus:outline-none hover:bg-blue-600" onClick={addQuiz}>
      Add Quiz
    </button>
  </div>
</div>

  )
}

export default UserDetails