
import React from 'react';
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TeamMember {
  id: string;
  name: string;
  initials: string;
}

interface TeamMemberFilterProps {
  teamMembers: TeamMember[];
  selectedTeamMembers: string[];
  toggleTeamMember: (memberId: string) => void;
}

export const TeamMemberFilter: React.FC<TeamMemberFilterProps> = ({
  teamMembers,
  selectedTeamMembers,
  toggleTeamMember
}) => {
  if (teamMembers.length === 0) return null;
  
  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Medarbejdere</h4>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <Users className="h-3 w-3 mr-1" />
            Vælg medarbejdere
            {selectedTeamMembers.length > 0 && (
              <Badge className="ml-2 bg-indigo-600">{selectedTeamMembers.length}</Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <div className="p-2">
            {teamMembers.map(member => (
              <div 
                key={member.id}
                className="flex items-center px-2 py-1 hover:bg-gray-100 rounded cursor-pointer"
                onClick={() => toggleTeamMember(member.id)}
              >
                <input 
                  type="checkbox" 
                  checked={selectedTeamMembers.includes(member.id)}
                  onChange={() => {}}
                  className="mr-2"
                />
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs mr-2">
                    {member.initials}
                  </div>
                  <span className="text-sm">{member.name}</span>
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
