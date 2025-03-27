
import React from "react";

interface EmployeeCardProps {
  initials: string;
  name: string;
  role: string;
  status: "online" | "busy" | "offline";
  project: string;
  phone: string;
  communicationTools: Array<string>;
}

const StatusBadge: React.FC<{ status: EmployeeCardProps["status"] }> = ({
  status,
}) => {
  const statusConfig = {
    online: { color: "bg-green-500", bgColor: "bg-green-100", textColor: "text-green-800", text: "Online" },
    busy: { color: "bg-yellow-500", bgColor: "bg-yellow-100", textColor: "text-yellow-800", text: "Optaget" },
    offline: { color: "bg-gray-500", bgColor: "bg-gray-100", textColor: "text-gray-800", text: "Offline" },
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status].bgColor} ${statusConfig[status].textColor}`}>
      <span className={`w-2 h-2 rounded-full ${statusConfig[status].color} mr-1`}></span>
      {statusConfig[status].text}
    </span>
  );
};

const CommunicationButton: React.FC<{ tool: string }> = ({ tool }) => {
  const toolConfig = {
    meet: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="text-red-500 mr-2">
          <path fill="currentColor" d="M19.7,11h-1.5v-1c0-0.6-0.4-1-1-1h-7.5c-0.6,0-1,0.4-1,1v4c0,0.6,0.4,1,1,1h7.5c0.6,0,1-0.4,1-1v-1h1.5c0.6,0,1-0.4,1-1v-1C20.7,11.4,20.3,11,19.7,11z" />
          <path fill="currentColor" d="M4.3,13v-2c0-0.6,0.4-1,1-1h1.5v4H5.3C4.7,14,4.3,13.6,4.3,13z" />
        </svg>
      ),
      label: "Meet",
    },
    teams: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="text-blue-600 mr-2">
          <path fill="currentColor" d="M19.2,6.4C19.2,5.1,18.1,4,16.8,4h-4c-1.3,0-2.4,1.1-2.4,2.4v3.2c0,1.3,1.1,2.4,2.4,2.4h4c1.3,0,2.4-1.1,2.4-2.4V6.4z" />
          <path fill="currentColor" d="M12,11.8V20c0,0,0,0-0.1,0c-2.3-0.9-4.3-2.4-5.9-4.4V9.4C7,9.2,8.2,9,9.4,9h0.3C9.5,10,10.7,11.5,12,11.8z" />
        </svg>
      ),
      label: "Teams",
    },
    zoom: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="text-blue-500 mr-2">
          <path fill="currentColor" d="M16.6,9.4L16.6,9.4L16.6,9.4c0.2-0.1,0.4-0.1,0.6-0.1c0.7,0,1.3,0.6,1.3,1.3v4.4c0,0.7-0.6,1.3-1.3,1.3c-0.2,0-0.4,0-0.6-0.1l0,0l0,0L14,15V9L16.6,9.4z" />
          <path fill="currentColor" d="M12,8H6.7C5.7,8,5,8.7,5,9.7v4.7c0,0.9,0.7,1.7,1.7,1.7H12c0.9,0,1.7-0.7,1.7-1.7V9.7C13.7,8.7,12.9,8,12,8z" />
        </svg>
      ),
      label: "Zoom",
    },
  };

  const toolInfo = toolConfig[tool as keyof typeof toolConfig];

  return (
    <button className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50">
      {toolInfo?.icon}
      <span className="text-xs font-medium">{toolInfo?.label}</span>
    </button>
  );
};

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  initials,
  name,
  role,
  status,
  project,
  phone,
  communicationTools,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
            <span className="text-xl font-bold text-indigo-600">{initials}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
            <p className="text-gray-600">{role}</p>
            <div className="flex items-center mt-1">
              <StatusBadge status={status} />
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Projekt: <span className="font-medium">{project}</span></p>
          <p className="text-sm text-gray-600 mb-4">Telefon: <span className="font-medium">{phone}</span></p>
          
          <div className="grid grid-cols-3 gap-2">
            {communicationTools.map((tool) => (
              <CommunicationButton key={tool} tool={tool} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
