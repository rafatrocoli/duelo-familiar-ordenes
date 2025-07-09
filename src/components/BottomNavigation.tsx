
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Hammer, Palette, Settings, Clipboard, Plus } from 'lucide-react';

export type Department = 'pedidos' | 'carpinteria' | 'nuevo' | 'montaje' | 'pintura';

interface BottomNavigationProps {
  activeDepartment: Department;
  onDepartmentChange: (department: Department) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  activeDepartment, 
  onDepartmentChange 
}) => {
  return (
    <div className="fixed bottom-8 left-4 right-4 z-50 bg-black rounded-2xl px-6 py-4 shadow-lg flex items-center justify-center">
      <Tabs value={activeDepartment} onValueChange={(value) => onDepartmentChange(value as Department)}>
        <TabsList className="flex w-full justify-between bg-transparent rounded-xl p-0 h-14 gap-4">
          <TabsTrigger 
            value="pedidos" 
            className="flex items-center justify-center h-14 px-4 rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white text-white hover:text-gray-300 transition-colors"
          >
            <Clipboard className="w-6 h-6" />
          </TabsTrigger>
          <TabsTrigger 
            value="montaje" 
            className="flex items-center justify-center h-14 px-4 rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white text-white hover:text-gray-300 transition-colors"
          >
            <Settings className="w-6 h-6" />
          </TabsTrigger>
          <TabsTrigger 
            value="nuevo"
            className="flex items-center justify-center h-14 px-4 rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white text-white hover:text-gray-300 transition-colors"
          >
            <Plus className="w-6 h-6" />
          </TabsTrigger>
          <TabsTrigger 
            value="carpinteria"
            className="flex items-center justify-center h-14 px-4 rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white text-white hover:text-gray-300 transition-colors"
          >
            <Hammer className="w-6 h-6" />
          </TabsTrigger>
          <TabsTrigger 
            value="pintura"
            className="flex items-center justify-center h-14 px-4 rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white text-white hover:text-gray-300 transition-colors"
          >
            <Palette className="w-6 h-6" />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default BottomNavigation;
