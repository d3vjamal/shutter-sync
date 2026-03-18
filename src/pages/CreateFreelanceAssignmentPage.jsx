import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppLayout from "../components/layouts/AppLayout";
import Header from "../components/Header";
import CreateFreelanceAssignment from "../components/CreateFreelanceAssignment";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { useFreelanceAssignments } from "../hooks/useFreelanceAssignments";

export default function CreateFreelanceAssignmentPage() {
  const { user, handleLogout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { createJob, updateJob } = useFreelanceAssignments(user);
  const navigate = useNavigate();
  const location = useLocation();
  const jobToEdit = location.state?.job;
  const isEditing = !!jobToEdit;

  const handleSave = async (data) => {
    const success = isEditing
      ? await updateJob(jobToEdit._id, data)
      : await createJob(data);
    if (success) navigate("/freelance");
  };

  return (
    <AppLayout user={user} onLogout={handleLogout} theme={theme} setTheme={setTheme}>
      <Header user={user} onLogout={handleLogout} theme={theme} setTheme={setTheme} />
      <CreateFreelanceAssignment
        onSave={handleSave}
        initialJob={jobToEdit}
        isEditing={isEditing}
      />
    </AppLayout>
  );
}
