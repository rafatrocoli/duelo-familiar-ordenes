
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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-2 pb-safe">
      <Tabs value={activeDepartment} onValueChange={(value) => onDepartmentChange(value as Department)}>
        <TabsList className="grid w-full grid-cols-3 bg-gray-50 rounded-xl p-1">
          <TabsTrigger 
            value="montaje" 
            className="flex flex-col items-center gap-1 py-3 px-4 rounded-lg text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-500"
          >
            <Settings className="w-4 h-4" />
            Montaje
          </TabsTrigger>
          <TabsTrigger 
            value="carpinteria"
            className="flex flex-col items-center gap-1 py-3 px-4 rounded-lg text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-500"
          >
            <Hammer className="w-4 h-4" />
            Carpintería
          </TabsTrigger>
          <TabsTrigger 
            value="pintura"
            className="flex flex-col items-center gap-1 py-3 px-4 rounded-lg text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-500"
          >
            <Palette className="w-4 h-4" />
            Pintura
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default BottomNavigation;
