
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
    online: { color: "bg-green-500", text: "Online" },
    busy: { color: "bg-yellow-500", text: "Optaget" },
    offline: { color: "bg-gray-500", text: "Offline" },
  };

  return (
    <div className="inline-flex items-center text-green-800 text-xs bg-green-100 px-2.5 py-0.5 rounded-full">
      <div
        className={`w-2 h-2 ${statusConfig[status].color} mr-1 rounded-[50%]`}
      />
      <span>{statusConfig[status].text}</span>
    </div>
  );
};

const CommunicationButton: React.FC<{ tool: string; icon: string }> = ({
  tool,
  icon,
}) => (
  <button className="flex items-center border border-gray-300 text-[11px] text-black cursor-pointer bg-white px-[47px] py-[9px] rounded-lg border-solid max-sm:w-full hover:bg-gray-50 transition-colors">
    <div dangerouslySetInnerHTML={{ __html: icon }} className="w-5 h-5 mr-2" />
    <span className="capitalize">{tool}</span>
  </button>
);

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
    <div className="shadow-[0_1px_2px_rgba(0,0,0,0.05)] w-[522px] bg-white p-6 rounded-lg max-md:w-full max-sm:p-4">
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 text-indigo-600 text-xl font-bold bg-indigo-100 mr-4 rounded-full flex items-center justify-center">
          {initials}
        </div>
        <div className="flex-1">
          <div className="text-lg font-bold text-gray-800 mb-1">{name}</div>
          <div className="text-[15px] text-gray-600 mb-1">{role}</div>
          <StatusBadge status={status} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-[13px] text-gray-600">Projekt: {project}</div>
        <div className="text-[13px] text-gray-600">Telefon: {phone}</div>
        <div className="flex gap-2 mt-2 max-sm:flex-col">
          {communicationTools.map((tool) => (
            <CommunicationButton
              key={tool}
              tool={tool}
              icon={`<svg>...</svg>`} // Icons would be properly implemented here
            />
          ))}
        </div>
      </div>
    </div>
  );
};
