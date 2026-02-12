import React, { useState } from "react";
import { FileText, Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export default function AgreementsManager({
  agreements = [],
  onAdd,
  onUpdate,
  onDelete,
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [newAgreement, setNewAgreement] = useState("");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAgreement, setEditingAgreement] = useState(null);
  const [updatedDescription, setUpdatedDescription] = useState("");

  const handleAdd = () => {
    if (newAgreement.trim()) {
      onAdd({ description: newAgreement });
      setNewAgreement("");
      setShowAdd(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this agreement?")) {
      onDelete({ id: id });
    }
  };

  const openEditModal = (agreement) => {
    setEditingAgreement(agreement);
    setUpdatedDescription(agreement.description);
    setEditModalOpen(true);
  };

  const handleUpdate = () => {
    if (updatedDescription.trim() && editingAgreement) {
      onUpdate({ id: editingAgreement._id, description: updatedDescription });
      setEditModalOpen(false);
      setEditingAgreement(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <FileText size={28} className="text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-foreground">
              Agreement Conditions
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Manage your agreement templates
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowAdd(!showAdd)}
          variant={showAdd ? "outline" : "default"}
          className="rounded-xl h-12 px-6 font-bold uppercase tracking-widest text-[10px] gap-2 shadow-lg"
        >
          {showAdd ? (
            "Cancel"
          ) : (
            <>
              <Plus size={16} />
              Add Condition
            </>
          )}
        </Button>
      </div>

      {showAdd && (
        <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-xl animate-in slide-in-from-top-4 duration-500 overflow-hidden">
          <CardHeader className="bg-primary/[0.03] border-b border-primary/5 pb-6">
            <CardTitle className="text-base font-black uppercase tracking-wider">
              New Agreement Condition
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">
                  Condition Description
                </Label>
                <Input
                  placeholder="e.g., 50% advance payment"
                  value={newAgreement}
                  onChange={(e) => setNewAgreement(e.target.value)}
                  className="h-12"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleAdd}
                  className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[10px] gap-2 shadow-lg"
                >
                  <Plus size={16} />
                  Add Condition
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-xl overflow-hidden">
        <CardHeader>
          <CardTitle>Agreement List</CardTitle>
          <CardDescription>Manage your agreement conditions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[640px] divide-y divide-border">
              <thead className="bg-muted-foreground/5">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold">
                    Description
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {agreements.map((agreement) => (
                  <tr key={agreement._id}>
                    <td className="px-4 py-3 align-top">
                      {agreement.description}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(agreement)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(agreement._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Agreement Condition</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={updatedDescription}
                onChange={(e) => setUpdatedDescription(e.target.value)}
              />
            </div>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
