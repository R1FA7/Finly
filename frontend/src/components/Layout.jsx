import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 dark:bg-gray-900">{children}</main>
    </div>
  );
};
export default Layout;
