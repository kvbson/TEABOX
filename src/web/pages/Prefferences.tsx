import React, { useState, useEffect } from 'react';

type Tag = string;

type Props = {
  getTags: () => Promise<{ data: Tag[] | null; error?: any }>;
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  setSuccessSave: React.Dispatch<React.SetStateAction<string | null>>;
};

const PreferencesPage: React.FC<Props> = ({ getTags, selectedTags, setSelectedTags, setSuccessSave }) => {
  const [allTags, setAllTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const result = await getTags();
        if (result?.data && Array.isArray(result.data)) {
          setAllTags(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      }
    };

    if (allTags.length === 0) {
      fetchTags();
    }
  }, [allTags.length, getTags]);

  const toggleTag = (tag: Tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSave = () => {
    localStorage.setItem('user-tags', JSON.stringify(selectedTags));
    setSuccessSave('Selected tags saved successfully.');
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
    </div>
  );
};

export default PreferencesPage;
