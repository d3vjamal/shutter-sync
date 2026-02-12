import React, { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { toast } from "react-toastify";
import AppLayout from "../components/layouts/AppLayout";

export default function ProfilePage() {
  const { user, handleLogout } = useAuth();
  const updateUserProfile = useMutation(api.users.updateUserProfile);
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [upiId, setUpiId] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setContact(user.contact || "");
      setUpiId(user.upiId || "");
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await updateUserProfile({
        name: name || undefined,
        contact: contact || undefined,
        upiId: upiId || undefined,
      });
      toast.success("Profile updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  return (
    <AppLayout
      user={user}
      onLogout={handleLogout}
      theme={theme}
      setTheme={setTheme}
    >
      <div className="max-w-3xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Manage Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Contact</Label>
                <Input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>UPI ID</Label>
                <Input
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave} className="rounded-xl">
                  Save Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
