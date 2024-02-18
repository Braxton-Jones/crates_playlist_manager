export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <section>
        <h2>Playlist Dashboard</h2>
        {children}
      </section>
    </main>
  );
}
