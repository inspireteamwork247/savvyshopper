import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { krogerApi } from "@/services/krogerApi";
import { walmartApi } from "@/services/walmartApi";

const APIStoreIntegration = () => {
  const testKrogerConnection = async () => {
    try {
      await krogerApi.authenticate();
      console.log("Kroger API connection successful");
    } catch (error) {
      console.error("Kroger API connection failed:", error);
    }
  };

  const testWalmartConnection = async () => {
    try {
      await walmartApi.authenticate();
      console.log("Walmart API connection successful");
    } catch (error) {
      console.error("Walmart API connection failed:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Kroger API Integration</CardTitle>
          <CardDescription>Manage Kroger API connection and settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>API Configuration Required</AlertTitle>
            <AlertDescription>
              Please ensure you have set up your Kroger API credentials in the project settings.
            </AlertDescription>
          </Alert>
          <Button onClick={testKrogerConnection}>Test Kroger Connection</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Walmart API Integration</CardTitle>
          <CardDescription>Manage Walmart API connection and settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>API Configuration Required</AlertTitle>
            <AlertDescription>
              Please ensure you have set up your Walmart API credentials in the project settings.
            </AlertDescription>
          </Alert>
          <Button onClick={testWalmartConnection}>Test Walmart Connection</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIStoreIntegration;