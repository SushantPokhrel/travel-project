import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { fetchData } from "@/lib/api";

type AdminUser = {
  _id: string;
  username: string;
  email: string;
  role: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
};

export default function AdminManageUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [message, setMessage] = useState("Loading users...");

  useEffect(() => {
    fetchData<{ users: AdminUser[] }>("/auth/users")
      .then((data) => {
        setUsers(data.users);
        setMessage("");
      })
      .catch((error) =>
        setMessage(
          error instanceof Error ? error.message : "Could not load users",
        ),
      );
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      <header>
        <p className="text-sm font-medium text-primary">Administration</p>
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <Users size={28} /> Manage users
        </h1>
        <p className="mt-1 text-muted-foreground">
          Tourists and guides are listed here. Administrator accounts are
          hidden.
        </p>
      </header>
      {message && (
        <p className="rounded-lg border p-3 text-sm text-muted-foreground">
          {message}
        </p>
      )}
      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full min-w-160 text-left text-sm">
          <thead className="border-b bg-muted/30 text-muted-foreground">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Status</th>
              <th className="p-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr className="border-b last:border-0" key={user._id}>
                <td className="p-4">
                  <p className="font-medium">{user.username}</p>
                  <p className="text-muted-foreground">{user.email}</p>
                </td>
                <td className="p-4 capitalize">{user.role}</td>
                <td className="p-4">{user.phone || "Not provided"}</td>
                <td className="p-4">
                  <span
                    className={
                      user.isActive ? "text-emerald-600" : "text-red-600"
                    }
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-4">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!message && users.length === 0 && (
        <p className="rounded-lg border p-6 text-center text-muted-foreground">
          No non-admin users found.
        </p>
      )}
    </div>
  );
}
