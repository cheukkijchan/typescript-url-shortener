import { useState } from 'react';
import { ShortUrlType } from '../App';

interface InputFormProps {
  onAdd: (args: ShortUrlType) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onAdd }) => {
  const [url, setUrl] = useState<string>('');
  const [slug, setSlug] = useState<string>('');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!url) {
      alert('Please enter url');
      return;
    }
    onAdd({ url, slug });

    setUrl('');
    setSlug('');
  };

  return (
    <form className='add-form' onSubmit={onSubmit}>
      <div className='form-control'>
        <label>Url</label>
        <input
          type='text'
          placeholder='Url Link'
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <div className='form-control'>
        <label>Custom Slug(Optional)</label>
        <input
          type='text'
          placeholder='Custom Slug'
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
      </div>
      <input className='btn btn-block' type='submit' value='Get!' />
    </form>
  );
};

export default InputForm;
