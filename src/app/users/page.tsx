'use client';

import { useState } from 'react';
import { User } from '@/types/user';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { UsersTable } from '@/components/users/users-table';
import { AddUserDialog } from '@/components/users/add-user-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';

const initialUsers: User[] = [
    {
        id: '1',
        name: 'Metro Margo',
        username: 'metro.margo',
        email: 'metro@example.com',
        role: 'Admin',
        status: 'active',
        createdAt: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'John Doe',
        username: 'john.doe',
        email: 'john@example.com',
        role: 'Manager',
        status: 'active',
        createdAt: new Date().toISOString(),
    },
    {
        id: '3',
        name: 'Jane Smith',
        username: 'jane.smith',
        email: 'jane@example.com',
        role: 'Sales Rep',
        status: 'active',
        createdAt: new Date().toISOString(),
    },
];

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [searchQuery, setSearchQuery] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSave = (userData: Omit<User, 'id' | 'createdAt'>) => {
        if (editUser) {
            setUsers(users.map(user =>
                user.id === editUser.id
                    ? { ...userData, id: user.id, createdAt: user.createdAt }
                    : user
            ));
            setEditUser(null);
        } else {
            const newUser: User = {
                ...userData,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
            };
            setUsers([...users, newUser]);
        }
        setDialogOpen(false);
    };

    const handleEdit = (user: User) => {
        setEditUser(user);
        setDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        setUsers(users.filter(user => user.id !== id));
    };

    const handleToggleStatus = (id: string) => {
        setUsers(users.map(user =>
            user.id === id
                ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
                : user
        ));
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />

            <div className="flex flex-1 flex-col overflow-hidden">
                <Navbar />

                <div className="flex-1 overflow-auto bg-gray-50 p-8">
                    <div className="mx-auto max-w-7xl space-y-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
                                <p className="text-muted-foreground">Manage system users and their roles</p>
                            </div>
                            <Button onClick={() => { setEditUser(null); setDialogOpen(true); }}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add User
                            </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="rounded-lg border bg-white p-4">
                                <p className="text-sm text-gray-600">Total Users</p>
                                <p className="text-2xl font-bold">{users.length}</p>
                            </div>
                            <div className="rounded-lg border bg-white p-4">
                                <p className="text-sm text-gray-600">Active Users</p>
                                <p className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</p>
                            </div>
                            <div className="rounded-lg border bg-white p-4">
                                <p className="text-sm text-gray-600">Admins</p>
                                <p className="text-2xl font-bold">{users.filter(u => u.role === 'Admin').length}</p>
                            </div>
                            <div className="rounded-lg border bg-white p-4">
                                <p className="text-sm text-gray-600">Managers</p>
                                <p className="text-2xl font-bold">{users.filter(u => u.role === 'Manager').length}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, username, email, or role..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <UsersTable
                            users={filteredUsers}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onToggleStatus={handleToggleStatus}
                        />

                        <AddUserDialog
                            open={dialogOpen}
                            onOpenChange={setDialogOpen}
                            onSave={handleSave}
                            editUser={editUser}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
