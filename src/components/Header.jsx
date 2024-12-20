import { Link } from "react-router-dom";
import { useFirebase } from "../context/firebase";

const Header = () => {
  const { loggedInUser } = useFirebase();

  return (
    <div className="sticky z-30 top-0">
      <div className="sticky flex justify-between items-center text-white shadow-lg bg-black px-4 p-5 w-screen overflow-hidden ">
        {/* Add pointer-events-none to ensure links are clickable */}
        <div className="before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:opacity-20 before:animate-[glossy_3s_infinite] before:z-0 before:pointer-events-none z-10"></div>
        
        <div>
          <img className="w-32" src="public/niu_logo.svg" alt="NIU Logo" />
        </div>
        <div className="flex-1 text-center text-5xl ml-20">NIU Gossip</div>
        <div className="mx-7 text-xl flex gap-4 z-10">
          <div>
            <Link to="/">Home</Link>
          </div>
          <div>
            <Link to="/contact">Contact Us</Link>
          </div>
          <div>
            <Link to="/signup">
              {loggedInUser ? loggedInUser : "Sign In"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
