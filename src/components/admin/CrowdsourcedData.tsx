import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CrowdsourcedData = () => {
  // Mock data - replace with actual data fetching
  const submissions = [
    {
      id: 1,
      store: "Local Market",
      submittedBy: "user123",
      date: "2024-02-20",
      status: "pending",
      type: "price_update",
    },
    {
      id: 2,
      store: "Fresh Foods",
      submittedBy: "user456",
      date: "2024-02-19",
      status: "verified",
      type: "new_store",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Recent Submissions</h3>
        <Button variant="outline">Export Data</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Store</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell>{submission.store}</TableCell>
              <TableCell>{submission.submittedBy}</TableCell>
              <TableCell>{submission.date}</TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {submission.type.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={submission.status === "verified" ? "success" : "warning"}>
                  {submission.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  Review
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CrowdsourcedData;