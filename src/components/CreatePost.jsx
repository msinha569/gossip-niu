import React, { useState } from 'react';
import { useFirebase } from '../context/firebase';


const CreatePost = () => {
    const [post, setPost] = useState('');
    const [isFocused, setIsFocused] = useState(false)
    const {handlePostEvent,} = useFirebase()

    return (
        <div className='sticky top-36 z-30 w-full flex justify-center'>
            <div className="relative w-2/4 ">
                <input
                    onFocus={()=>setIsFocused(true)} onBlur={()=>setIsFocused(false)}
                    value={post}  
                    onKeyDown={(e) => e.key === 'Enter' && handlePostEvent(post, setPost)}
                    onChange={(e) => setPost(e.target.value)}
                    className="border-2 border-gray-300 rounded-lg p-2 pr-12 w-full focus:border-gray-500 transition-colors duration-100"
                    placeholder="Create a Post While Being Anonymous"
                />

                <button 
                className={`text-2xl items-center absolute right-10 transition-transform duration-300 ease-in-out ${
                isFocused ? '-translate-x-7 opacity-100' : 'translate-x-full opacity-0'
                } text-white p-2 rounded-l-md`}
                >
                🔽
                </button>

                <button
                    onClick={() => handlePostEvent(post, setPost)}
                    className="absolute right-0 top-0 bottom-0 bg-red-500 text-white rounded-r-lg px-4 py-2"
                    style={{ height: 'calc(100% - 1px)' }} 
                >
                    POST
                </button>
            </div>
        </div>
    );
};

export default CreatePost;
