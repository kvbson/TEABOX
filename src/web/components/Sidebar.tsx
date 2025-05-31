import React, { useEffect, useRef, useMemo } from 'react';
import { createSwapy, Swapy } from 'swapy';
import PriorityArrow from './ui/PriorityArrow';
import { useTopmostTags } from '../hooks/useTopmostTags'; // ścieżkę dopasuj do siebie

type SidebarProps = {
  sidebarOpened: boolean;
  selectedTags: string[];
  setSidebarTags: React.Dispatch<React.SetStateAction<string[]>>;
};

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpened, selectedTags, setSidebarTags }) => {
  const swapyRef = useRef<Swapy | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data, loading, error } = useTopmostTags();

  // Przekształcamy dane z API do formatu {id, text} + ewentualnie sortujemy wg localStorage
  const options = useMemo(() => {
    const baseOptions = (selectedTags.length > 0 ? selectedTags : data).map((text, index) => ({
      id: (index + 1).toString(),
      text,
    }));

    const saved = localStorage.getItem('sidebar-items');
    if (!saved) return baseOptions;

    try {
      const savedOptions: { id: string; text: string }[] = JSON.parse(saved);

      // Odtwarzamy kolejność zapisaną w localStorage, zachowując tylko istniejące elementy
      const sorted = savedOptions
        .map((savedItem) => baseOptions.find((item) => item.text === savedItem.text))
        .filter(Boolean) as { id: string; text: string }[];

      // Dodajemy brakujące elementy (np. nowe tagi z API)
      const missing = baseOptions.filter(
        (item) => !sorted.some((sortedItem) => sortedItem.text === item.text),
      );

      return [...sorted, ...missing];
    } catch {
      return baseOptions;
    }
  }, [data, selectedTags]);

  useEffect(() => {
    if (!containerRef.current || loading || !options.length) return;

    swapyRef.current = createSwapy(containerRef.current, {
      animation: 'dynamic',
      dragAxis: 'y',
    });

    swapyRef.current.onSwapEnd(({ slotItemMap }) => {
      const sortedIds = Object.values(slotItemMap.asArray).map(({ item }) => item);

      const sortedOptions = sortedIds
        .map((id) => options.find((option) => option.id === id))
        .filter(Boolean);

      setSidebarTags(sortedOptions.map(el => el?.text).filter(Boolean) as string[]);
      const dbSaveJSON = JSON.stringify(sortedOptions);
      console.log('[Swapy] Zapisano:', dbSaveJSON);
      localStorage.setItem('sidebar-items', dbSaveJSON);
    });

    return () => {
      swapyRef.current?.destroy();
    };
  }, [options, loading, setSidebarTags]);

  if (loading) return ;
  if (error) return <div className="sidebar">Error: {error instanceof Error ? error.message : String(error)}</div>;

  return (
    <div className={`sidebar ${!sidebarOpened ? 'hide' : ''}`}>
      <h3>What flavors are the most important?</h3>
      <div className="swapy-container">
        <div className="priority-arrow">
          <span className="top">MOST</span>
          <div className="arrow-line">
            <PriorityArrow />
          </div>
          <span className="bottom">LEAST</span>
        </div>
        {((loading) => loading ? <div className="sidebar">Loading...</div> : <div className="swapy-list" ref={containerRef}>
          {options.map(({ id, text }) => (
            <div className="swapy-slot" data-swapy-slot={id} key={id}>
              <div className="swapy-item" data-swapy-item={id}>
                {text}
              </div>
            </div>
          ))}
        </div>)(loading)}

      </div>
      <p>
        Drag and drop your preferences to set sorting for the recommendations
      </p>
    </div>
  );
};

export default Sidebar;
