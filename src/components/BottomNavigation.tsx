
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Hammer, Palette, Settings } from 'lucide-react';

export type Department = 'montaje' | 'carpinteria' | 'pintura';

interface BottomNavigationProps {
  activeDepartment: Department;
  onDepartmentChange: (department: Department) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  activeDepartment, 
  onDepartmentChange 
}) => {
  return (
    <div className="fixed bottom-8 left-4 right-4 z-50 bg-black rounded-2xl px-4 py-3 shadow-lg">
      <Tabs value={activeDepartment} onValueChange={(value) => onDepartmentChange(value as Department)}>
        <TabsList className="grid w-full grid-cols-3 bg-transparent rounded-xl p-0">
          <TabsTrigger 
            value="montaje" 
            className="flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-lg text-xs font-medium data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 hover:text-gray-300 transition-colors min-h-[60px]"
          >
            <Settings className="w-5 h-5" />
            Montaje
          </TabsTrigger>
          <TabsTrigger 
            value="carpinteria"
            className="flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-lg text-xs font-medium data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 hover:text-gray-300 transition-colors min-h-[60px]"
          >
            <Hammer className="w-5 h-5" />
            Carpintería
          </TabsTrigger>
          <TabsTrigger 
            value="pintura"
            className="flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-lg text-xs font-medium data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 hover:text-gray-300 transition-colors min-h-[60px]"
          >
            <Palette className="w-5 h-5" />
            Pintura
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default BottomNavigation;
