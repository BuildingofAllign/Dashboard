
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ProfileSettings: React.FC = () => {
  const [urls, setUrls] = useState<string[]>([
    "https://shaden.com",
    "http://twitter.com/shadcn"
  ]);

  const addUrl = () => {
    setUrls([...urls, ""]);
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-1">Profile</h2>
        <p className="text-muted-foreground text-sm mb-6">
          This is how others will see you on the site.
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="block font-medium">
              Username
            </label>
            <Input id="username" defaultValue="shadcn" />
            <p className="text-sm text-muted-foreground">
              This is your public display name. It can be your real name or a pseudonym. You can only change this once every 30 days.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block font-medium">
              Email
            </label>
            <Select defaultValue="">
              <SelectTrigger>
                <SelectValue placeholder="Select a verified email to display" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email@example.com">email@example.com</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              You can manage verified email addresses in your email settings.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="bio" className="block font-medium">
              Bio
            </label>
            <Textarea id="bio" defaultValue="I own a computer." className="min-h-[100px]" />
            <p className="text-sm text-muted-foreground">
              You can @mention other users and organizations to link to them.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block font-medium">
              URLs
            </label>
            <p className="text-sm text-muted-foreground mb-2">
              Add links to your website, blog, or social media profiles.
            </p>
            
            <div className="space-y-3">
              {urls.map((url, index) => (
                <Input 
                  key={index}
                  value={url}
                  onChange={(e) => updateUrl(index, e.target.value)}
                />
              ))}
              
              <Button 
                variant="outline" 
                type="button" 
                onClick={addUrl}
                size="sm"
                className="mt-2"
              >
                Add URL
              </Button>
            </div>
          </div>

          <div className="pt-4">
            <Button type="button">
              Update profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
