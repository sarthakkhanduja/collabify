import logoImg from "../assets/logo-no-bg.png";
import travelImg from "../assets/travel-illustration.png";

function navigate(url: string) {
    window.location.href = url;
}
  
async function auth() {
    const response = await fetch('http://localhost:3001/api/v1/creator', { method: 'post' });

    const data = await response.json();
    console.log(data);
    navigate(data.url);
}

function SignUp() {
  return (
    
    <div className="w-full h-screen p-4 dark:bg-gray-800 flex flex-col items-center">
        <div className="h-1/2 flex items-center justify-center">
            <img src={travelImg} />
        </div>
        <h4 className="mt-8 text-3xl font-medium text-gray-900 dark:text-white text-center">Collaborate Confidently!</h4>
        <h5 className="mt-8 text-xl font-medium text-gray-900 dark:text-white text-center">Use <span className=" text-yellow-300">Collabify</span> to connect with contributors, even on the go</h5>
        
        <button className="w-full mt-12 px-4 py-2 border gap-2 border-slate-200 flex justify-center items-center text-sm dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
                onClick={() => auth()}>
            <img className="w-5 h-5" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google-logo" />
            <span>Continue with Google</span>
        </button>
    </div>

  )
}

export default SignUp