
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/services/authApi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/auth");
      toast.success("Successfully logged out!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Button variant="destructive" onClick={handleLogout}>
      Logout
    </Button>
  );
};
