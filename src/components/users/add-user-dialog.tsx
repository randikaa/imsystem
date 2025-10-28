'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, UserRole } from '@/types/user';
import { Eye, EyeOff } from 'lucide-react';

interface AddUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (user: Omit<User, 'id' | 'createdAt'>) => void;
    editUser?: User | null;
}

export function AddUserDialog({ open, onOpenChange, onSave, editUser }: AddUserDialogProps) {
    const [formData, setFormData] = useState<{
        name: string;
        username: string;
        email: string;
        role: UserRole;
        status: 'active' | 'inactive';
        password: string;
        confirmPassword: string;
    }>({
        name: '',
        username: '',
        email: '',
        role: 'User',
        status: 'active',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (editUser) {
            setFormData({
                name: editUser.name,
                username: editUser.username,
                email: editUser.email,
                role: editUser.role,
                status: editUser.status,
                password: '',
                confirmPassword: '',
            });
        } else {
            setFormData({
                name: '',
                username: '',
                email: '',
                role: 'User',
                status: 'active',
                password: '',
                confirmPassword: '',
            });
        }
        setErrors({});
    }, [editUser, open]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!editUser) {
            if (!formData.password) {
                newErrors.password = 'Password is required';
            } else if (formData.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters';
            }

            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Please confirm password';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const { password, confirmPassword, ...userData } = formData;
        onSave(userData);
        setFormData({
            name: '',
            username: '',
            email: '',
            role: 'User',
            status: 'active',
            password: '',
            confirmPassword: '',
        });
        setErrors({});
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{editUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="name" className="text-sm font-medium">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter full name"
                            />
                            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="username" className="text-sm font-medium">
                                Username <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                placeholder="Enter username"
                            />
                            {errors.username && <p className="text-xs text-red-500">{errors.username}</p>}
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Enter email address"
                            />
                            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="role" className="text-sm font-medium">
                                Role <span className="text-red-500">*</span>
                            </label>
                            <Select value={formData.role} onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                    <SelectItem value="Manager">Manager</SelectItem>
                                    <SelectItem value="User">User</SelectItem>
                                    <SelectItem value="Sales Rep">Sales Rep</SelectItem>
                                    <SelectItem value="Cashier">Cashier</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {!editUser && (
                            <>
                                <div className="grid gap-2">
                                    <label htmlFor="password" className="text-sm font-medium">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder="Enter password"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                    {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                                        Confirm Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            placeholder="Confirm password"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                    {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
                                </div>
                            </>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">{editUser ? 'Update' : 'Add'} User</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
