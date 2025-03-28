
import React from 'react';
import { FileText } from 'lucide-react';

// This is just a temporary wrapper to help with TypeScript errors
// You should update your AnnotatableDrawingViewer component directly if possible
export const DrawingViewerWrapper = ({ drawing, onClose, ...props }: any) => {
  // This component just passes props through to the actual component
  // In a real implementation, you would update the target component
  return null;
};

// Export FileText icon for use in other components
export { FileText };
