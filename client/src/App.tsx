function navigate(url: string) {
  window.location.href = url;
}

async function auth() {
  const response = await fetch('http://localhost:3001/api/v1/creator', { method: 'post' });

  const data = await response.json();
  console.log(data);
  navigate(data.url);
}

function App() {
  return (
    <div>
      <button onClick={() => auth()}>Login with Google</button>
    </div>
  )
}

export default App
