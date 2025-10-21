import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 dark:bg-gray-900 dark:text-gray-100">
        {children}
      </main>
      <footer className="border-t border-slate-200 dark:border-slate-700/50 px-6 lg:px-10 py-5 text-center text-salte-800 dark:text-slate-400 bg-gray-100 dark:bg-slate-800">
        <p>&copy; 2025 Finly. All rights reserved.</p>
      </footer>
    </div>
  );
};
export default Layout;
