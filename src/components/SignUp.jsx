import React, { useState } from 'react'
import { useFirebase } from '../context/firebase'
import { Link, useNavigate } from 'react-router-dom'

function SignUp() {
    const[userName, setUserName] = useState('')
    const[email, setEmail] = useState('')
    const[error, setError] = useState('')
    const[loading, setLoading] = useState(false)
    const[password, setPassword] = useState('')
    const {signUpUser, loggedInUser, signingOut, handleSigningIn, sendPasswordResetEmail} = useFirebase()
    const[userLoggedIn, setUserLoggedIn] = useState(true)
    const nav = useNavigate()

    const toggleUserLoggedIn = () => {
        setUserLoggedIn(!userLoggedIn)
    }

    const handleInputChange = (setter) => (e) => {
        setError('')
        setter(e.target.value)
    }

    const signingUp = async() => {
        setLoading(true)
        setError('')
        try{
            const user =  await signUpUser(email, password, userName)
            console.log(user)
            nav('/')
        }catch(err){
            console.log(err)
            
            setError(err.message)
        }finally{
            setLoading(false)
        }

    }

    const signingIn = async() => {
        setLoading(true)
        setError('')
        try{
            const user = await handleSigningIn(email, password)
            
        }catch(err){
            setError(err.message)
        }finally{
            setLoading(false)
        }
    }
    
    const handleForgotPassword = async(email) => {
        setLoading(true)
        setError('')
        try{
            await sendPasswordResetEmail(email)
        }catch(err){
            setError(err.message)
        }finally{
            setLoading(false)
        }
    }
    const signingInComponent = () => {
        return(
            <div className="flex flex-col items-center justify-center h-full space-y-5">
            {!userLoggedIn && <input
                placeholder='Enter Your UserName'
                className='w-72 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
                onChange={handleInputChange(setUserName)}
            />}
        
             <input
                placeholder='Enter Your Email'
                className='w-72 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
                onChange={handleInputChange(setEmail)}
            />

            <div className='flex'>
            <input
                placeholder='Enter Your Password'
                type='password'
                className={`w-72 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${ userLoggedIn ? 'ml-16' : 'ml-4' }`}     
                onChange={handleInputChange(setPassword)}  />
            <div className='text-red-700 mt-3 mx-2 cursor-pointer'
                onClick={()=>handleForgotPassword(email)}>
                {userLoggedIn && 'Forget?'}
            </div>
            </div>
        
            <button 
                onClick={() => !userLoggedIn?signingUp():signingIn()} 
                disabled={loading}
                className={`w-72 bg-blue-600 text-white font-semibold rounded-lg p-3 transition duration-200 
                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
                {loading ? 'Signing Up' : (!loggedInUser?'Sign In':'Sign Up')}
            </button>

            <div className='cursor-pointer' onClick={()=>toggleUserLoggedIn()}>
                {userLoggedIn?"Create an Account":"Already have an account?"}
             
            </div>
        </div>
        )

    }

    const signingOutComponent = () => {
        return(
            <div>
                <button className='w-72 bg-blue-600 text-white font-semibold rounded-lg p-3 transition duration-200 hover:bg-blue-700 '
                 onClick={() => signingOut()}>Sign Out</button>
            </div>
        )
    }    

  return (
    <div className='m-5'>
        {loggedInUser? signingOutComponent() : signingInComponent()}
      

       {error && <div> {error}</div> } 
    </div>
  )
}

export default SignUp
