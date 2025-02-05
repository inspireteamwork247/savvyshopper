import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import APIStoreIntegration from "@/components/admin/APIStoreIntegration";
import ManualStoreEntry from "@/components/admin/ManualStoreEntry";
import CrowdsourcedData from "@/components/admin/CrowdsourcedData";
import WebScrapingConfig from "@/components/admin/WebScrapingConfig";

const Admin = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Store Management Admin</h1>
      
      <Tabs defaultValue="api" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="api">API Integration</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="crowdsource">Crowdsourced</TabsTrigger>
          <TabsTrigger value="scraping">Web Scraping</TabsTrigger>
        </TabsList>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Integration</CardTitle>
              <CardDescription>Connect to supermarket APIs like Kroger and Walmart</CardDescription>
            </CardHeader>
            <CardContent>
              <APIStoreIntegration />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Manual Data Entry</CardTitle>
              <CardDescription>Manually add and update store information</CardDescription>
            </CardHeader>
            <CardContent>
              <ManualStoreEntry />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crowdsource">
          <Card>
            <CardHeader>
              <CardTitle>Crowdsourced Data</CardTitle>
              <CardDescription>Manage user-submitted store information</CardDescription>
            </CardHeader>
            <CardContent>
              <CrowdsourcedData />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scraping">
          <Card>
            <CardHeader>
              <CardTitle>Web Scraping Configuration</CardTitle>
              <CardDescription>Configure and manage web scraping settings</CardDescription>
            </CardHeader>
            <CardContent>
              <WebScrapingConfig />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;