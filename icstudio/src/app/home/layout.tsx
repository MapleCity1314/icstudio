
import Nav from "@/components/nav";

export default function RootLayout({
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

