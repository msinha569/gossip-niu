import React, { useEffect, useState } from 'react'
import { useFirebase } from '../context/firebase'
import PostItem from './PostItem'

function PostList({forceRender}) {

    const[post, setPost] = useState([])
    const {readData} = useFirebase()


    useEffect(() => {
        
        readData(setPost,forceRender)
        console.log(post);
    }, [])
    console.log(post);
    
    if (post.length===0){
        return <div className='text-white text-2xl'>Loading Posts...</div>
    }
    return (
    <div className='h-50 w-full z-0  space-y-3'>
    {post.map((p) => 
        !p.hide ? <PostItem key={p.id} p={p} /> : null
    )}
    </div>

    )
}

export default PostList
