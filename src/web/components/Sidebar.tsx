import React, { useMemo, useState } from 'react';
import { useTopmostTags } from '../hooks/useTopmostTags';
import PriorityArrow from './ui/PriorityArrow';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function getRandomSample<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

type SidebarProps = {
  sidebarOpened: boolean;
  selectedTags: string[];
  setSidebarTags: React.Dispatch<React.SetStateAction<string[]>>;
};

type Option = {
  id: string;
  text: string;
};

const SortableItem = ({ id }: { id: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="swapy-slot">
      <div className="swapy-item">{id}</div>
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpened, selectedTags, setSidebarTags }) => {
  const { data, loading, error } = useTopmostTags();
  const [arrowHeight, setArrowHeight] = useState<number>(0);
  const [orderedOptions, setOrderedOptions] = useState<Option[]>([]);

  const sensors = useSensors(useSensor(PointerSensor));

  const options = useMemo(() => {
    const basePool = selectedTags.length > 0 ? selectedTags : getRandomSample(data ?? [], 5);
    const baseOptions = basePool.map((text) => ({
      id: text,
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
        (item) => !sorted.some((sortedItem) => sortedItem.text === item.text)
      );

      return [...sorted, ...missing];
    } catch {
      return baseOptions;
    }
  }, [data, selectedTags]);

  React.useEffect(() => {
    setOrderedOptions(options);
    setSidebarTags(options.map((opt) => opt.text));
    localStorage.setItem('sidebar-items', JSON.stringify(options));
  }, [options]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedOptions.findIndex((item) => item.id === active.id);
    const newIndex = orderedOptions.findIndex((item) => item.id === over.id);

    const newOrder = arrayMove(orderedOptions, oldIndex, newIndex);
    setOrderedOptions(newOrder);
    setSidebarTags(newOrder.map((item) => item.text));
    localStorage.setItem('sidebar-items', JSON.stringify(newOrder));
  };

  if (loading) return null;
  if (error) {
    return <div className="sidebar">Error: {error instanceof Error ? error.message : String(error)}</div>;
  }

  return (
    <div className={`sidebar ${!sidebarOpened ? 'hide' : ''}`}>
      <h3>What flavors are the most important?</h3>
      <div className="swapy-container">
        <div className="priority-arrow">
          <span className="top">MOST</span>
          <div
            className="arrow-line"
            style={{
              height: arrowHeight ? `${arrowHeight - 150}px` : '50px',
              width: '40px',
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
            if (el) setArrowHeight(el.offsetHeight);
          }}
        >
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={orderedOptions.map((opt) => opt.id)} strategy={verticalListSortingStrategy}>
              {orderedOptions.map((option) => (
                <SortableItem key={option.id} id={option.id} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
      <p className="bottom-text">
        Drag and drop your preferences to set sorting for the recommendations
      </p>
    </div>
  );
};

export default Sidebar;
