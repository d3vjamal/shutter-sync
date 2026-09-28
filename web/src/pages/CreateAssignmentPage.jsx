import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppLayout from "../components/layouts/AppLayout";
import Header from "../components/Header";
import CreateAssignment from "../components/CreateAssignment";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { useAssignments } from "../hooks/useAssignments";

export default function CreateAssignmentPage() {
  const { user, handleLogout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { createAssignment, updateAssignment } = useAssignments(user);
  const navigate = useNavigate();
  const location = useLocation();
  const assignmentToEdit = location.state?.assignment;
  const isEditing = !!assignmentToEdit;

  const handleSave = async (assignmentData) => {
    if (isEditing) {
      const success = await updateAssignment(
        assignmentToEdit._id,
        assignmentData,
      );
      if (success) {
        navigate("/dashboard");
      }
    } else {
      const success = await createAssignment(assignmentData);
      if (success) {
        navigate("/dashboard");
      }
    }
  };

  return (
    <AppLayout
      user={user}
      onLogout={handleLogout}
      theme={theme}
      setTheme={setTheme}
    >
      <Header
        user={user}
        onLogout={handleLogout}
        theme={theme}
        setTheme={setTheme}
      />
      <CreateAssignment
        onSave={handleSave}
        initialAssignment={assignmentToEdit}
        isEditing={isEditing}
      />
    </AppLayout>
  );
}
