import AdminLayout from "@/components/layout/admin/admin-layout";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
      return (
            <Suspense>
                  <AdminLayout>{children}</AdminLayout>
            </Suspense>
      );
}
