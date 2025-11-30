import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, X, Save, Upload } from "lucide-react";
import { updateUser, deleteUser } from "@/services/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  state: string;
  city: string;
  country: string;
  pincode: string;
  role: string;
  profile_image?: string;
  created_at: string;
  updated_at: string;
}

interface UserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const UserModal = ({ user, isOpen, onClose, onRefresh }: UserModalProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    city: "",
    country: "",
    pincode: "",
    profile_image: null as File | null
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address || "",
        state: user.state,
        city: user.city,
        country: user.country,
        pincode: user.pincode,
        profile_image: null
      });
      setImagePreview(user.profile_image ? `http://localhost:5000${user.profile_image}` : "");
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size must be less than 2MB",
          variant: "destructive"
        });
        return;
      }
      
      setFormData({ ...formData, profile_image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          formDataToSend.append(key, value);
        }
      });

      await updateUser(user.id, formDataToSend);
      
      toast({
        title: "Success",
        description: "User updated successfully"
      });
      
      setIsEditing(false);
      onRefresh();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update user",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await deleteUser(user.id);
      
      toast({
        title: "Success",
        description: "User deleted successfully"
      });
      
      setShowDeleteDialog(false);
      onRefresh();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete user",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>User Details</span>
              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                {user.role}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              {isEditing ? "Edit user information" : "View user information"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Profile Image */}
            <div className="flex items-center gap-4">
              {imagePreview && (
                <img 
                  src={imagePreview} 
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-border"
                />
              )}
              {isEditing && (
                <Label htmlFor="profile_image_edit" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">Change Image</span>
                  </div>
                  <Input
                    id="profile_image_edit"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </Label>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                {isEditing ? (
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <p className="text-sm p-2 bg-muted rounded">{user.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                {isEditing ? (
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <p className="text-sm p-2 bg-muted rounded">{user.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Phone</Label>
                {isEditing ? (
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <p className="text-sm p-2 bg-muted rounded">{user.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                {isEditing ? (
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                ) : (
                  <p className="text-sm p-2 bg-muted rounded">{user.address || "N/A"}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Country</Label>
                {isEditing ? (
                  <Input
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <p className="text-sm p-2 bg-muted rounded">{user.country}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>State</Label>
                {isEditing ? (
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <p className="text-sm p-2 bg-muted rounded">{user.state}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>City</Label>
                {isEditing ? (
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <p className="text-sm p-2 bg-muted rounded">{user.city}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Pincode</Label>
                {isEditing ? (
                  <Input
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <p className="text-sm p-2 bg-muted rounded">{user.pincode}</p>
                )}
              </div>
            </div>

            {!isEditing && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label>Created At</Label>
                  <p className="text-sm p-2 bg-muted rounded">
                    {new Date(user.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Last Updated</Label>
                  <p className="text-sm p-2 bg-muted rounded">
                    {new Date(user.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={loading}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="bg-gradient-primary hover:opacity-90 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-primary hover:opacity-90 text-white"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              <span className="font-semibold"> {user.name}</span> and remove all their data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserModal;
