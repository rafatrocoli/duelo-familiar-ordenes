import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clipboard, Hammer, Plus, Settings, Palette } from 'lucide-react';

export type Department = 'pedidos' | 'carpinteria' | 'pintura' | 'montaje' | 'nuevo';

interface BottomNavigationProps {
  activeDepartment: Department;
  onDepartmentChange: (department: Department) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  activeDepartment, 
  onDepartmentChange 
}) => {
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50">
      <div className="mx-4 mb-4">
        <Tabs value={activeDepartment} onValueChange={onDepartmentChange}>
          <TabsList className="grid grid-cols-5 w-full bg-black rounded-xl p-0 h-14">
            <TabsTrigger
              value="pedidos"
              className="flex items-center justify-center h-14 min-w-[60px] mx-2 rounded-lg text-white data-[state=active]:bg-white/10 hover:text-gray-300 transition-colors"
            >
              <Clipboard className="w-6 h-6" />
            </TabsTrigger>

            <TabsTrigger
              value="carpinteria"
              className="flex items-center justify-center h-14 min-w-[60px] mx-2 rounded-lg text-white data-[state=active]:bg-white/10 hover:text-gray-300 transition-colors"
            >
              <Hammer className="w-6 h-6" />
            </TabsTrigger>

            <TabsTrigger
              value="nuevo"
              className="flex items-center justify-center h-14 min-w-[60px] mx-2 rounded-lg text-white data-[state=active]:bg-white/10 hover:text-gray-300 transition-colors"
            >
              <Plus className="w-6 h-6" />
            </TabsTrigger>

            <TabsTrigger
              value="montaje"
              className="flex items-center justify-center h-14 min-w-[60px] mx-2 rounded-lg text-white data-[state=active]:bg-white/10 hover:text-gray-300 transition-colors"
            >
              <Settings className="w-6 h-6" />
            </TabsTrigger>

            <TabsTrigger
              value="pintura"
              className="flex items-center justify-center h-14 min-w-[60px] mx-2 rounded-lg text-white data-[state=active]:bg-white/10 hover:text-gray-300 transition-colors"
            >
              <Palette className="w-6 h-6" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default BottomNavigation;