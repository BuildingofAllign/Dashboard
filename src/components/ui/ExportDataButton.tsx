
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileJson, FileSpreadsheet, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ExportFormat = 'json' | 'csv' | 'pdf';

interface ExportDataButtonProps {
  data: any;
  fileName?: string;
  formats?: ExportFormat[];
  onExport?: (format: ExportFormat) => void;
  className?: string;
}

export const ExportDataButton: React.FC<ExportDataButtonProps> = ({
  data,
  fileName = 'export',
  formats = ['json', 'csv', 'pdf'],
  onExport,
  className = ""
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = (format: ExportFormat) => {
    setIsExporting(true);

    try {
      if (onExport) {
        onExport(format);
      } else {
        if (format === 'json') {
          exportJson();
        } else if (format === 'csv') {
          exportCsv();
        } else if (format === 'pdf') {
          // PDF export would typically require a library
          // This is a placeholder that shows a notification
          toast({
            title: "PDF Export",
            description: "PDF export funktionalitet vil blive implementeret snart.",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Eksport fejlede",
        description: "Der opstod en fejl under eksport af data.",
        variant: "destructive",
      });
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportJson = () => {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    downloadFile(blob, `${fileName}.json`);
    
    toast({
      title: "Data eksporteret",
      description: `Data er blevet eksporteret som JSON til ${fileName}.json`,
    });
  };

  const exportCsv = () => {
    // If data is an array of objects
    if (Array.isArray(data) && data.length > 0) {
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(item => Object.values(item).join(','));
      const csvContent = [headers, ...rows].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      downloadFile(blob, `${fileName}.csv`);
      
      toast({
        title: "Data eksporteret",
        description: `Data er blevet eksporteret som CSV til ${fileName}.csv`,
      });
    } else {
      toast({
        title: "Eksport fejlede",
        description: "CSV eksport kræver et array af objekter",
        variant: "destructive",
      });
    }
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`flex items-center gap-2 ${className}`}
          disabled={isExporting}
        >
          <Download className="h-4 w-4" />
          <span>Eksporter</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {formats.includes('json') && (
          <DropdownMenuItem onClick={() => handleExport('json')}>
            <FileJson className="h-4 w-4 mr-2" />
            <span>JSON</span>
          </DropdownMenuItem>
        )}
        {formats.includes('csv') && (
          <DropdownMenuItem onClick={() => handleExport('csv')}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            <span>CSV</span>
          </DropdownMenuItem>
        )}
        {formats.includes('pdf') && (
          <DropdownMenuItem onClick={() => handleExport('pdf')}>
            <FileText className="h-4 w-4 mr-2" />
            <span>PDF</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
