import { useState } from 'react';
import Kitchen from './Kitchen.jsx';

function App() {
  const [messages, setMessages] = useState('');
  const [response, setResponse] = useState(null);
  const [subdomain, setSubdomain] = useState('demo');
  const [view, setView] = useState('customer'); // 'customer' or 'kitchen'

  const sendOrder = async () => {
    const res = await fetch(`/api/${subdomain}/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: messages }] })
    });
    const data = await res.json();
    setResponse(JSON.stringify(data, null, 2));
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">AI Waiter</h1>
      <div className="space-x-2">
        <button onClick={() => setView('customer')} className={`px-3 py-1 rounded ${view==='customer' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Customer</button>
        <button onClick={() => setView('kitchen')} className={`px-3 py-1 rounded ${view==='kitchen' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Kitchen</button>
      </div>
      <div>
        <label className="block mb-1 font-semibold">Restaurant Subdomain</label>
        <input
          value={subdomain}
          onChange={(e) => setSubdomain(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>
      {view === 'customer' ? (
        <>
          <div>
            <label className="block mb-1 font-semibold">Your request</label>
            <textarea
              value={messages}
              onChange={(e) => setMessages(e.target.value)}
              className="border rounded p-2 w-full"
              rows="4"
            />
          </div>
          <button onClick={sendOrder} className="bg-blue-500 text-white px-4 py-2 rounded">
            Send to AI Waiter
          </button>
          {response && (
            <pre className="bg-gray-100 p-2 rounded overflow-x-auto">{response}</pre>
          )}
        </>
      ) : (
        <Kitchen subdomain={subdomain} />
      )}
    </div>
  );
}

export default App;
