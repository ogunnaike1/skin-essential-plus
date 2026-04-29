import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-ivory">
      <AdminSidebar />
      
      <div className="ml-64">
        <AdminHeader title={title} subtitle={subtitle} />
        
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}