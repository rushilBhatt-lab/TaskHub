import NavBar from './_components/NavBar';

const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="h-full">
      <NavBar />
      {children}
    </div>
  );
};

export default DashboardLayout;
