import { useState } from "react"
import ChatBox from "../components/ChatBox"
import CreatePost from "../components/CreatePost"
import PostList from "../components/PostList"
import { useFirebase } from "../context/firebase"
import { BackgroundGradient } from "../components/ui/background-gradient"

const Body = () => {

    const {renderKey} = useFirebase()

    const bigscreen = "fixed right-16 my-16 ml-4 h-4/6 w-96 border-2"
    const smallscreen = "hidden"
    return(
        <div key={renderKey} className="flex flex-col items-center w-full h-screen ">
        <CreatePost/>
        <div className="flex flex-wrap justify-center  w-full max-w-2xl  ">
          <div className="w-4/6 h-1/2 sm:h-full my-8  ">
            <PostList />
          </div>
          <div>
            
          </div>
          <div className="hidden sm:block fixed right-16 my-16 ml-4  ">
           <ChatBox />
          </div>
          <div className="min-w-1/2 my-16 ml-4   sm:hidden ">
          <ChatBox />
          </div>
        </div>
      </div>
      
      
    )
}
export default Body