import { useState } from 'react';
import { Header } from './components/Header';
import InputForm from './components/InputForm';

// Types
export type ShortUrlType = {
  url: string;
  slug: string;
};

function App() {
  const [shortUrl, setShortUrl] = useState<string>('');

  // Create Short Url
  const createShortUrl = async (args: ShortUrlType) => {
    const { url, slug } = args;
    const res = await fetch('http://localhost:4000/url', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ url, slug }),
    });

    const data = await res.json();
    setShortUrl(`http://localhost:4000/${data.slug}`);
  };
  return (
    <div className='container'>
      <Header title='Url Shortener' />
      <InputForm onAdd={createShortUrl} />
      {shortUrl && (
        <div className='form-result'>
          <h3>Short Url Created! Share the link below</h3>
          <a href={shortUrl}>{shortUrl}</a>
        </div>
      )}
    </div>
  );
}

export default App;
