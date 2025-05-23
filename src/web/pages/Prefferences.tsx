import React, { useState, useEffect } from 'react';

type Tag = string;

type Props = {
  getTags: () => Promise<{ data: Tag[] | null; error?: any }>;
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  setSuccessSave: React.Dispatch<React.SetStateAction<string | null>>;
  setError: React.Dispatch<React.SetStateAction<string | Error | null>>;
};

const PreferencesPage: React.FC<Props> = ({ getTags, selectedTags, setSelectedTags, setSuccessSave, setError }) => {
  const [allTags, setAllTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const result = await getTags();
        if (result?.data && Array.isArray(result.data)) {
          setAllTags(result.data);
        }
      } catch (error) {
        if (error) {
          setError(error as Error);
        }
        console.error('Failed to fetch tags:', error instanceof Error ? error.message : String(error));
      }
    };

    if (allTags.length === 0) {
      fetchTags();
    }
  }, [allTags.length, getTags, setError]);

  const toggleTag = (tag: Tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSave = () => {
    localStorage.setItem('user-tags', JSON.stringify(selectedTags));
    setSuccessSave('Selected tags saved successfully.');
  };

  const handleReset = () => {
    localStorage.setItem('user-tags', JSON.stringify(selectedTags));
    setSuccessSave('Selected tags reseted.');
    setSelectedTags([]);
  };

  return (
    <div className="preferences-page">
      <h2>Your Preferences</h2>
      <p>Select tags you're interested in:</p>
      <div className="tag-list">
        {allTags.map((tag) => (
          <button
            key={tag}
            className={`tag-button ${selectedTags.includes(tag) ? 'selected' : ''}`}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <button onClick={handleSave} className="save-button">
        Save Preferences
      </button>
      <button onClick={handleReset} className="remove-button">
        Reset
      </button>
    </div>
  );
};

export default PreferencesPage;
