
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search as SearchIcon, 
  X, 
  History, 
  ArrowDown, 
  Clock, 
  Filter 
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface SearchResult {
  id: string;
  title: string;
  type: 'project' | 'deviation' | 'task' | 'document';
  description?: string;
  url: string;
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters?: string[]) => Promise<SearchResult[]>;
  placeholder?: string;
  className?: string;
  maxHistory?: number;
  filters?: string[];
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  placeholder = 'Søg efter projekter, opgaver, dokumenter...',
  className = '',
  maxHistory = 5,
  filters = ['projects', 'deviations', 'tasks', 'documents'],
}) => {
  const [query, setQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    // Load search history from localStorage
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse search history', e);
      }
    }
  }, []);

  const saveSearchHistory = (history: string[]) => {
    localStorage.setItem('searchHistory', JSON.stringify(history));
  };

  const addToHistory = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const newHistory = [
      searchQuery,
      ...searchHistory.filter(item => item !== searchQuery)
    ].slice(0, maxHistory);
    
    setSearchHistory(newHistory);
    saveSearchHistory(newHistory);
  };

  const removeFromHistory = (searchQuery: string) => {
    const newHistory = searchHistory.filter(item => item !== searchQuery);
    setSearchHistory(newHistory);
    saveSearchHistory(newHistory);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const searchResults = await onSearch(query, activeFilters);
      setResults(searchResults);
      addToHistory(query);
      setShowDialog(true);
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const getFilterIcon = (filter: string) => {
    switch (filter) {
      case 'projects':
        return <span className="rounded-full bg-blue-100 w-6 h-6 flex items-center justify-center text-blue-600 mr-2">P</span>;
      case 'deviations':
        return <span className="rounded-full bg-red-100 w-6 h-6 flex items-center justify-center text-red-600 mr-2">A</span>;
      case 'tasks':
        return <span className="rounded-full bg-green-100 w-6 h-6 flex items-center justify-center text-green-600 mr-2">O</span>;
      case 'documents':
        return <span className="rounded-full bg-yellow-100 w-6 h-6 flex items-center justify-center text-yellow-600 mr-2">D</span>;
      default:
        return null;
    }
  };

  const getFilterLabel = (filter: string) => {
    switch (filter) {
      case 'projects':
        return 'Projekter';
      case 'deviations':
        return 'Afvigelser';
      case 'tasks':
        return 'Opgaver';
      case 'documents':
        return 'Dokumenter';
      default:
        return filter;
    }
  };

  const getResultTypeIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <span className="rounded-full bg-blue-100 w-6 h-6 flex items-center justify-center text-blue-600">P</span>;
      case 'deviation':
        return <span className="rounded-full bg-red-100 w-6 h-6 flex items-center justify-center text-red-600">A</span>;
      case 'task':
        return <span className="rounded-full bg-green-100 w-6 h-6 flex items-center justify-center text-green-600">O</span>;
      case 'document':
        return <span className="rounded-full bg-yellow-100 w-6 h-6 flex items-center justify-center text-yellow-600">D</span>;
      default:
        return null;
    }
  };

  return (
    <div className={className}>
      <div className="flex flex-col space-y-2">
        <div className="flex">
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              className="pl-10"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button onClick={handleSearch} disabled={isSearching} className="ml-2">
                {isSearching ? 'Søger...' : 'Søg'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Søgeresultater for "{query}"</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                {results.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <SearchIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Ingen resultater fundet for "{query}"</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {results.map(result => (
                      <a 
                        key={result.id} 
                        href={result.url}
                        className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="mr-3">
                          {getResultTypeIcon(result.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{result.title}</h4>
                          {result.description && (
                            <p className="text-sm text-gray-600">{result.description}</p>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.map(filter => (
            <Badge 
              key={filter}
              variant={activeFilters.includes(filter) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleFilter(filter)}
            >
              {getFilterIcon(filter)}
              {getFilterLabel(filter)}
              {activeFilters.includes(filter) && (
                <button className="ml-1" onClick={(e) => {
                  e.stopPropagation();
                  toggleFilter(filter);
                }}>
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Search history dropdown */}
      {searchHistory.length > 0 && (
        <div className="mt-2">
          <Command>
            <CommandInput placeholder="Søg i historik..." />
            <CommandList>
              <CommandEmpty>Ingen søgehistorik matcher</CommandEmpty>
              <CommandGroup heading="Seneste søgninger">
                {searchHistory.map((historyItem, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => {
                      setQuery(historyItem);
                      handleSearch();
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <History className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{historyItem}</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromHistory(historyItem);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </CommandItem>
                ))}
                <CommandItem onSelect={clearHistory} className="text-red-500 hover:text-red-700">
                  <X className="h-4 w-4 mr-2" />
                  <span>Ryd søgehistorik</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};
