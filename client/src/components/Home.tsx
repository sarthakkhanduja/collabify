import { GoHome } from "react-icons/go";
import { PiHandshakeFill } from "react-icons/pi";
import { FaRegUser } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import plus from "../assets/plusSign.svg";
import profilePicture from '../assets/sample-profile-picture.jpg';
import { useState } from "react";
import axios from 'axios';


function Home() {
    const [homeClicked, setHomeClicked] = useState(false);
    const [searchClicked, setSearchClicked] = useState(false);
    const [collabClicked, setCollabClicked] = useState(false);
    const [profileClicked, setProfileClicked] = useState(false);


    async function getName() {
        const res = await axios.get("http://localhost:3001/getName");

    }

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
                <div className="w-full p-2 flex flex-row justify-around items-center mt-4">
                    <div className="h-24 rounded-xl w-full bg-gray-800 flex flex-col cursor-pointer justify-center items-center">
                        <img className="size-14" src={plus} alt="Add Project" />
                        <p className="text-sm text-gray-200">New Collab</p>
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
                    <GoHome className={`size-7 ${homeClicked === false ? 'text-white' : 'text-black'}`}/>
                </div>
                <div className={`h-full w-1/4 flex justify-center rounded-3xl items-center ${searchClicked === false ? '' : 'bg-[#fff458]'}`} onClick={() => {
                    setHomeClicked(false);
                    setSearchClicked(true);
                    setCollabClicked(false);
                    setProfileClicked(false);
                }}>
                    <IoIosSearch  className={`size-6 ${searchClicked === false ? 'text-white' : 'text-black'}`} />
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
                    <FaRegUser className={`size-6 ${profileClicked === false ? 'text-white' : 'text-black'}`} />
                </div>
            </div>
        </div>
        
    )
}

export default Home;