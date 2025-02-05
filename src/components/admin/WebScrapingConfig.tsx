import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const WebScrapingConfig = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="space-y-6">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Web scraping may be subject to legal restrictions. Please ensure compliance with each website's terms of service.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="scraping-enabled">Enable Web Scraping</Label>
          <Switch
            id="scraping-enabled"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="interval">Scraping Interval (minutes)</Label>
          <Input
            id="interval"
            type="number"
            min="5"
            defaultValue="60"
            disabled={!enabled}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="user-agent">Custom User Agent</Label>
          <Input
            id="user-agent"
            placeholder="Mozilla/5.0..."
            disabled={!enabled}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="proxy">Proxy Configuration</Label>
          <Input
            id="proxy"
            placeholder="http://proxy:port"
            disabled={!enabled}
          />
        </div>

        <Button disabled={!enabled}>Save Configuration</Button>
      </div>
    </div>
  );
};

export default WebScrapingConfig;