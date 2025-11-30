import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Search, Plus } from "lucide-react";
import { getUsers } from "@/services/api";
import UserTable from "@/components/UserTable";
import UserModal from "@/components/UserModal";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  state: string;
  city: string;
  country: string;
  pincode: string;
  role: string;
  created_at: string;
  updated_at: string;
  address?: string;
  profile_image?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(user);
    if (userData.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges",
        variant: "destructive"
      });
      navigate("/");
      return;
    }

    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm) ||
        user.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully"
    });
    navigate("/");
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-soft sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">Manage users and system settings</p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card p-6 rounded-2xl shadow-soft border border-border">
            <p className="text-muted-foreground text-sm mb-1">Total Users</p>
            <p className="text-3xl font-bold text-foreground">{users.length}</p>
          </div>
          <div className="bg-card p-6 rounded-2xl shadow-soft border border-border">
            <p className="text-muted-foreground text-sm mb-1">Active Users</p>
            <p className="text-3xl font-bold text-primary">{users.filter(u => u.role === 'user').length}</p>
          </div>
          <div className="bg-card p-6 rounded-2xl shadow-soft border border-border">
            <p className="text-muted-foreground text-sm mb-1">Admins</p>
            <p className="text-3xl font-bold text-accent">{users.filter(u => u.role === 'admin').length}</p>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="bg-card p-6 rounded-2xl shadow-soft border border-border mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by name, email, phone, state, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={handleRefresh}
              className="bg-gradient-primary hover:opacity-90 text-white"
            >
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
          <UserTable
            users={filteredUsers}
            loading={loading}
            onViewUser={handleViewUser}
            onRefresh={handleRefresh}
          />
        </div>
      </main>

      {/* User Modal */}
      <UserModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default Dashboard;
