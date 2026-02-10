import { useEffect, useState } from 'react';

function App() {
  const [status, setStatus] = useState('loading...');

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus('ERROR'));
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1>React Frontend</h1>
      <p>Backend Health: <b>{status}</b></p>
    </div>
  );
}

export default App;
