import Carousel from "./Carousel";

import travelImg from "../assets/travel-illustration.png";
import contentCreatorImg from "../assets/content-creator-illustration.png";
import collaborateImg from "../assets/collaborate-illustration.png";

function navigate(url: string) {
    window.location.href = url;
}
  
async function authCreator() {
    const response = await fetch('http://localhost:3001/api/v1/creator/auth/google', { method: 'post' });

    const data = await response.json();
    console.log(data);
    navigate(data.url);
}

async function authContributor() {
    const response = await fetch('http://localhost:3001/api/v1/contributor/auth/google', { method: 'post' });

    const data = await response.json();
    console.log(data);
    navigate(data.url);
}

const imgSlides = [
    travelImg,
    contentCreatorImg,
    collaborateImg
  ]

function SignUp() {
  return (    
    <div className="w-full h-screen p-4 sm:p-8 dark:bg-gray-900 flex flex-col items-center">
        {/* <div className="h-1/2 sm:h-3/5 flex items-center justify-center">
            <img src={travelImg} />
        </div> */}
        <div className="h-1/2 sm:h-3/5 flex items-center justify-center">
            <Carousel slides={imgSlides}/>
        </div>
        <h5 className="mt-8 text-xl sm:text-2xl font-medium text-gray-900 dark:text-white text-center">Use <span className=" text-yellow-300">Collabify</span> to connect with contributors, even on the go</h5>


        <div className="w-full mt-16 px-16 py-4 border-t-[1px] border-gray-400">
            <div className="mb-4">
                <h6 className="mt-8 text-xl sm:text-2xl font-medium text-gray-900 dark:text-white text-center">Sign up as</h6>
            </div>
            <div className="flex flex-row items-end justify-end">
                <button className="w-full sm:w-3/5 mt-2 px-4 py-2 border gap-2 border-slate-200 flex justify-center items-center text-sm dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
                    onClick={() => authCreator()}>Creator</button>
                <button className="w-full sm:w-3/5 mt-2 px-4 py-2 border gap-2 border-slate-200 flex justify-center items-center text-sm dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
                    onClick={() => authContributor()}>Contributor</button>
            </div>
        </div>
        
        {/* <button className="w-4/5 sm:w-3/5 mt-24 px-4 py-2 border gap-2 border-slate-200 flex justify-center items-center text-sm dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
                onClick={() => auth()}>
            <img className="w-5 h-5" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google-logo" />
            <span>Continue with Google</span>
        </button> */}
        <h6 className="mt-4 text-xs text-center text-gray-500">By continuing further you agree to our <span className="text-blue-500">terms and conditions</span> and our <span className="text-blue-500">privacy poliicy</span></h6>
    </div>

  )
}

export default SignUp