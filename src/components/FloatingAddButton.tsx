
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface FloatingAddButtonProps {
  onClick: () => void;
}

const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-black hover:bg-gray-800 shadow-lg transition-all duration-200 hover:scale-105 z-40"
      size="icon"
    >
      <Plus className="w-6 h-6 text-white" />
    </Button>
  );
};

export default FloatingAddButton;
