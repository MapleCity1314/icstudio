
import Nav from "@/components/nav";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        <Nav />
        {children} 
    </div>
  );
}

