//Prepared for dragndrop
const initialOptions = [
  { id: 1, text: 'In Library' },
  { id: 2, text: 'Indie' },
  { id: 3, text: 'Reviews' },
  { id: 4, text: 'Players' },
  { id: 5, text: 'Casual' },
  { id: 6, text: 'Latest' },
  { id: 7, text: 'Genre' },
  { id: 8, text: 'Cost' },
];

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <h3>What flavors are the most important?</h3>
      <ul>
        {initialOptions.map(({ id, text }) => {
          return <li key={id}>{text}</li>;
        })}
      </ul>
      <p>Drag and drop your preferences to set sorting for the recommendations</p>
    </div>
  );
};

export default Sidebar;
