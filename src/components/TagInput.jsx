import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const TagInput = ({ tags, setTags }) => {
  const [input, setInput] = useState('');

  const addTag = (e) => {
    if (e.key === 'Enter' && input.trim() !== '') {
      setTags([...tags, input.trim()]);
      setInput('');
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-wrap items-center flex-grow">
      {tags.map((tag, index) => (
        <div key={index} className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2 mb-2 flex items-center">
        {tag}
          <FontAwesomeIcon icon={faXmark} onClick={() => removeTag(index)}/>
      </div>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={addTag}
        className="border-none outline-none flex-grow bg-transparent p-2 text-black"
      />
      
    </div>
  );
};

export default TagInput;
