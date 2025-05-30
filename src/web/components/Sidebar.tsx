import React, { useEffect, useRef, useMemo, useState } from 'react';
import { createSwapy, Swapy } from 'swapy';
import PriorityArrow from './ui/PriorityArrow';
import { useTopmostTags } from '../hooks/useTopmostTags'; // ścieżkę dopasuj do siebie

type SidebarProps = {
  menuOpened: boolean;
  selectedTags: string[];
  setSidebarTags: React.Dispatch<React.SetStateAction<string[]>>;
};

const Sidebar: React.FC<SidebarProps> = ({ menuOpened, selectedTags, setSidebarTags }) => {
  const swapyRef = useRef<Swapy | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const swapyListRef = useRef<HTMLDivElement>(null);
  const [arrowHeight, setArrowHeight] = useState<number>(0);

  const { data, loading, error } = useTopmostTags();

  const options = useMemo(() => {
    const baseOptions = (selectedTags.length > 0 ? selectedTags : data).map((text, index) => ({
      id: (index + 1).toString(),
      text,
    }));

    const saved = localStorage.getItem('sidebar-items');
    if (!saved) return baseOptions;

    try {
      const savedOptions: { id: string; text: string }[] = JSON.parse(saved);

      const sorted = savedOptions
        .map((savedItem) => baseOptions.find((item) => item.text === savedItem.text))
        .filter(Boolean) as { id: string; text: string }[];

      const missing = baseOptions.filter(
        (item) => !sorted.some((sortedItem) => sortedItem.text === item.text),
      );

      return [...sorted, ...missing];
    } catch {
      return baseOptions;
    }
  }, [data, selectedTags]);

  // Set up Swapy
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

  // Set arrow height after options are rendered
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (swapyListRef.current) {
        const height = swapyListRef.current.offsetHeight;
        if (height > 0) {
          setArrowHeight(height);
        }
      }
    }, 0); // działa jak "po layoucie"
  
    return () => clearTimeout(timeout);
  }, [options]);

  if (loading) return null;
  if (error) {
    return (
      <div className="sidebar">
        Error: {error instanceof Error ? error.message : String(error)}
      </div>
    );
  }

  return (
    <div className={`sidebar ${!menuOpened ? 'hide' : ''}`}>
      <h3>What flavors are the most important?</h3>
      <div className="swapy-container">
        <div className="priority-arrow">
          <span className="top">MOST</span>
          <div
  className="arrow-line"
  style={{
    height: arrowHeight ? `${arrowHeight - 150}px` : '50px',
    width: '40px', // lub dowolna stała szerokość
    minWidth: '40px',
    maxWidth: '40px',
  }}
>
  <PriorityArrow />
</div>
          <span className="bottom">LEAST</span>
        </div>

        <div
          className="swapy-list"
          ref={(el) => {
            containerRef.current = el;
            swapyListRef.current = el;
          }}
        >
          {options.map(({ id, text }) => (
            <div className="swapy-slot" data-swapy-slot={id} key={id}>
              <div className="swapy-item" data-swapy-item={id}>
                {text}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="bottom-text">
        Drag and drop your preferences to set sorting for the recommendations
      </p>
    </div>
  );
};

export default Sidebar;