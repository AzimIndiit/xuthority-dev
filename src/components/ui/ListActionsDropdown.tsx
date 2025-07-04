import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';

interface ListActionsDropdownProps {
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
}

const ListActionsDropdown: React.FC<ListActionsDropdownProps> = ({
  onEdit,
  onDelete,
  disabled = false
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-600 hover:text-gray-800 h-8"
          disabled={disabled}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="sr-only">List actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="">
        <DropdownMenuItem 
          onClick={onEdit}
          className="cursor-pointer"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={onDelete}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ListActionsDropdown; 