import { AiFillHome } from "react-icons/ai";
import { PiHandshakeFill } from "react-icons/pi";
import { FaUser } from "react-icons/fa";
import { ImSearch } from "react-icons/im";
import profilePicture from '../assets/sample-profile-picture.jpg';
import { useState } from "react";


function Home() {
    const [homeClicked, setHomeClicked] = useState(false);
    const [searchClicked, setSearchClicked] = useState(false);
    const [collabClicked, setCollabClicked] = useState(false);
    const [profileClicked, setProfileClicked] = useState(false);

    return(
        <div className="flex flex-col bg-[#10100E] h-screen justify-center items-center p-4">
            <div className="h-full w-full">
                <div className="h-[10%] w-full p-4 rounded-3xl flex flex-row hover:bg-gray-400">
                    <div className="flex justify-center items-center">
                        <img src={profilePicture} alt="Profile Picture" className="rounded-full size-16 object-cover"></img>
                    </div>
                    <div className="flex flex-col pl-4 justify-center items-start">
                        <p className="text-md text-[#737373]">Good Morning</p>
                        <p className="text-xl font-semibold text-[#D9D9D9]">Sarthak Khanduja</p>
                    </div>                    
                </div>
            </div>
            <div className="h-[7%] p-2 w-[90%] absolute bottom-8 bg-gray-800 rounded-3xl z-10 flex flex-row justify-center opacity-70">
                <div className={`h-full w-1/4 flex justify-center rounded-3xl items-center ${homeClicked === false ? '' : 'bg-[#fff458]'}`} onClick={() => {
                    setHomeClicked(true);
                    setSearchClicked(false);
                    setCollabClicked(false);
                    setProfileClicked(false);
                }}>
                    <AiFillHome className={`size-7 ${homeClicked === false ? 'text-white' : 'text-black'}`}/>
                </div>
                <div className={`h-full w-1/4 flex justify-center rounded-3xl items-center ${searchClicked === false ? '' : 'bg-[#fff458]'}`} onClick={() => {
                    setHomeClicked(false);
                    setSearchClicked(true);
                    setCollabClicked(false);
                    setProfileClicked(false);
                }}>
                    <ImSearch  className={`size-6 ${searchClicked === false ? 'text-white' : 'text-black'}`} />
                </div>
                <div className={`h-full w-1/4 flex justify-center rounded-3xl items-center ${collabClicked === false ? '' : 'bg-[#fff458]'}`} onClick={() => {
                    setHomeClicked(false);
                    setSearchClicked(false);
                    setCollabClicked(true);
                    setProfileClicked(false);
                }}>
                    <PiHandshakeFill className={`size-8 ${collabClicked === false ? 'text-white' : 'text-black'}`} />
                </div>
                <div className={`h-full w-1/4 flex justify-center rounded-3xl items-center ${profileClicked === false ? '' : 'bg-[#fff458]'}`} onClick={() => {
                    setHomeClicked(false);
                    setSearchClicked(false);
                    setCollabClicked(false);
                    setProfileClicked(true);
                }}>
                    <FaUser className={`size-6 ${profileClicked === false ? 'text-white' : 'text-black'}`} />
                </div>
            </div>
        </div>
    )
}

export default Home;