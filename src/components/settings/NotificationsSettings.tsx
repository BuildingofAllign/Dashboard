
import React, { useState } from "react";
import { AnimatedList } from "@/components/ui/AnimatedList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterSelect } from "@/components/ui/FilterButton";
import { ComboboxOption } from "@/components/ui/Combobox";

export const NotificationsSettings: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState("all");

  // Define notification type options
  const notificationTypeOptions: ComboboxOption[] = [
    { value: "all", label: "Alle typer" },
    { value: "project", label: "Projekt" },
    { value: "message", label: "Besked" },
    { value: "task", label: "Opgave" },
    { value: "alert", label: "Advarsel" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Notifications</h2>
        <p className="text-muted-foreground text-sm">
          Configure how you receive notifications.
        </p>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Notifications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Notifications</CardTitle>
              <FilterSelect 
                options={notificationTypeOptions}
                value={typeFilter}
                onValueChange={setTypeFilter}
                className="w-[180px]"
              />
            </CardHeader>
            <CardContent>
              <AnimatedList maxHeight="600px" filter={typeFilter} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-10">
                Notification settings will be available soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
