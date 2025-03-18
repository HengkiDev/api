import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch(/api/downloader?url=${encodeURIComponent(url)});
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to download TikTok video');
      }
      
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Head>
        <title>TikTok Downloader</title>
        <meta name="description" content="TikTok video downloader" />
      </Head>

      <main>
        <h1>TikTok Downloader</h1>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter TikTok video URL"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Download'}
          </button>
        </form>

        {error && <div className="error">{error}</div>}
        
        {result && (
          <div className="result">
            <h2>Download Links:</h2>
            {result.data && result.data.play && (
              <div>
                <a href={result.data.play} target="_blank" rel="noopener noreferrer">
                  Download Video
                </a>
              </div>
            )}
            {result.data && result.data.music && (
              <div>
                <a href={result.data.music} target="_blank" rel="noopener noreferrer">
                  Download Audio
                </a>
              </div>
            )}
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </main>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          text-align: center;
        }
        form {
          display: flex;
          margin-bottom: 20px;
        }
        input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px 0 0 4px;
        }
        button {
          padding: 10px 20px;
          background-color: #1da1f2;
          color: white;
          border: none;
          border-radius: 0 4px 4px 0;
          cursor: pointer;
        }
        button:disabled {
          background-color: #ccc;
        }
        .error {
          color: red;
          margin-bottom: 20px;
        }
        .result {
          margin-top: 20px;
        }
        pre {
          background-color: #f5f5f5;
          padding: 10px;
          border-radius: 4px;
          overflow-x: auto;
        }
      `}</style>
    </main>
  );
}
