
import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { GlassCard, Button, Input } from './UI';

const EditAssignmentModal = ({ assignment, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: assignment.title || assignment.packageName || '',
        clientName: assignment.clientName || '',
        clientContact: assignment.clientContact || '',
        amount: assignment.amount || assignment.totalAmount || '',
        paidAmount: assignment.paidAmount || '0',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(assignment._id, formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <GlassCard className="w-full max-w-md p-6 relative bg-[var(--surface)] text-[var(--text-primary)]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold mb-6">Edit Assignment</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase opacity-60 mb-1">Title</label>
                        <Input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Assignment Title"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase opacity-60 mb-1">Client Name</label>
                        <Input
                            name="clientName"
                            value={formData.clientName}
                            onChange={handleChange}
                            placeholder="Client Name"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase opacity-60 mb-1">Contact</label>
                        <Input
                            name="clientContact"
                            value={formData.clientContact}
                            onChange={handleChange}
                            placeholder="Phone or Email"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase opacity-60 mb-1">Total Amount</label>
                            <Input
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase opacity-60 mb-1">Paid Amount</label>
                            <Input
                                name="paidAmount"
                                value={formData.paidAmount}
                                onChange={handleChange}
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" onClick={onClose} variant="secondary" className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 flex items-center justify-center gap-2">
                            <Save size={16} />
                            Save Changes
                        </Button>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
};

export default EditAssignmentModal;
