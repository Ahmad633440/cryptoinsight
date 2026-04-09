export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Add public-specific UI here later: Navbar, Footer, etc. */}
      {children}
    </>
  );
}
