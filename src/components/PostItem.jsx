import { useState } from "react"
import { useFirebase } from "../context/firebase"
import { BackgroundGradient } from "./ui/background-gradient"
import { HoverBorderGradient } from "./ui/hover-border-gradient"


const PostItem = ({p}) => {

    const[likeCount, setLikeCount] = useState(p.likes)
    const[dislikeCount, setDislikeCount] = useState(p.dislikes)
    const {handleDislikeCount, handleLikeCount, loggedInUser} = useFirebase()
    
  

    return (
     
      <div className="w-full flex flex-col justify-between">
        <HoverBorderGradient
        containerClassName=" w-full "
        
        className="dark:bg-black bg-white   flex-col justify-between text-black dark:text-white flex items-center space-x-2"
      >
        <div className=" flex items-start p-2 font-mono text-xl">
            {p.description}
        </div>
        <div className="flex justify-between text-xl  py-2 px-6 h-10 rounded-b-lg">
            <div><button onClick={() => handleLikeCount(likeCount, setLikeCount, p, loggedInUser)}>
            👍{likeCount}
            </button></div>
            <div><button onClick={() => handleDislikeCount(dislikeCount, setDislikeCount,p, loggedInUser)}>
               👎 {dislikeCount}
            </button></div>
        </div>
        </HoverBorderGradient>
      </div>
    )
}

export default PostItem
