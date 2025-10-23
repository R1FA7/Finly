export const finlyFaqInfo = [
  {
    id: 1,
    content: `Finly is a comprehensive personal finance tracking application. 
    It helps users manage their income and expenses through an intuitive dashboard with real-time analytics. 
    Users can track transactions, set financial goals, and export their data for offline analysis. 
    The application uses JWT-based authentication with email verification for secure access.`,
    category: "general",
    title: "About Finly"
  },
  {
    id: 2,
    content: `To add a transaction in Finly, navigate to the Dashboard page after logging in. 
    Click on the 'Add Transaction' button, which will open a form. Fill in the required details including 
    transaction type (income or expense), amount, source or category, description, and date. 
    Click 'Save' to record the transaction. The transaction will immediately appear in your transaction list 
    and be reflected in all charts and analytics on the dashboard.`,
    category: "transactions",
    title: "Adding Transactions"
  },
  {
    id: 3,
    content: `Finly provides powerful analytics through interactive charts and visualizations. 
    The dashboard displays your financial data in multiple formats: line charts showing income vs expense trends, 
    bar charts for source-wise and category-wise breakdowns, and summary cards showing totals. 
    You can filter the data by different time periods - weekly, monthly, or yearly. 
    All charts update in real-time as you add, edit, filter, real time search or delete transactions. Also u can see all time total income or expense and maximum amount of income or expense. Also advanced transaction filtering includes different range based such as time, amount etc.`,
    category: "analytics",
    title: "Dashboard Analytics"
  },
  {
    id: 4,
    content: `Finly allows you to export your transaction data to Excel format for offline analysis. 
    To export data, go to the Dashboard and locate the 'Export to Excel' button. 
    Clicking this button will download a .xlsx file containing all your transaction records 
    with details like date, type, amount, source/category, and description. 
    This feature is useful for creating custom reports or sharing data with financial advisors.`,
    category: "export",
    title: "Data Export"
  },
  {
    id: 5,
    content: `Setting financial goals for both income and expense in Finly helps you track savings targets. 
    Visit the Goals in dashboard page from the navigation menu. Click 'Goal' and enter details 
    like target amount, deadline, and optional description. The goals page shows progress bars, remaining amount and completion percentages for each goal.`,
    category: "goals",
    title: "Financial Goals"
  },
  {
    id: 6,
    content: `Finly implements robust security measures to protect your financial data. 
    Authentication uses JWT tokens with both access and refresh tokens for secure sessions. 
    All passwords are encrypted using bcrypt hashing. Email verification with OTP ensures account authenticity. 
    The application uses HTTPS for encrypted data transmission. Your financial data is stored securely 
    in MongoDB with proper access controls. We never share your personal or financial information with third parties.`,
    category: "security",
    title: "Security Features"
  },
  {
    id: 7,
    content: `If you forget your password, Finly provides a secure password reset mechanism. 
    On the login page, click the 'Forgot Password' link. Enter your registered email address. 
    You will receive an OTP (One-Time Password) via email. Enter this OTP on the verification page. 
    After verification, you can set a new password. The OTP expires after a certain time for security.`,
    category: "account",
    title: "Password Reset"
  },
  {
    id: 8,
    content: `Finly's transaction filtering system helps you find specific transactions quickly. 
    Use the search bar to find transactions by description. Filter by transaction type to see only income or expenses. 
    Apply date range filters to view transactions from specific periods. Sort by amount to identify your largest 
    transactions. You can also filter by source (for income) or category (for expenses). 
    Multiple filters can be combined for precise results.`,
    category: "transactions",
    title: "Transaction Filtering"
  },
  {
    id: 9,
    content: `If you excess your income or expense goal in home page you receive instant notification. You can dismiss those notification or by info button(i) u can review your goal related notification. Also any kind of annoucement from admin you can view those in the home page.`,
    category: "general",
    title: "Notification and announcement"
  },
  {
    id: 10,
    content: `Finly is a fully responsive web application that works seamlessly on mobile devices. 
    You can access Finly from any mobile browser by visiting the same URL you use on desktop. 
    The interface automatically adapts to smaller screens, making it easy to add transactions, 
    view analytics, and manage goals on the go. All features available on desktop are accessible on mobile. 
    For the best experience, use modern browsers like Chrome, Safari, or Firefox.`,
    category: "general",
    title: "Mobile Access"
  },
  {
    id: 11,
    content: `To create a Finly account, visit the registration page and provide your name, email address, and password. Make sure to use a valid email address as it's required for password recovery.`,
    category: "account",
    title: "Account Registration"
  },
  {
    id: 12,
    content: `Finly's dashboard updates in real-time without requiring page refreshes. 
    When you add, edit, or delete a transaction, all charts, graphs, and summary statistics 
    are automatically recalculated and updated instantly. This includes income vs expense charts, 
    category breakdowns, source distributions, and total balance calculations. 
    The real-time updates ensure you always see the most current state of your finances.`,
    category: "analytics",
    title: "Real-time Updates"
  },
  {
    id: 13,
    content: `Finly supports both admin and regular user roles with different permissions. 
    Admin users can access the admin panel to manage users, send announcements, and view system-wide analytics. 
    Regular users can manage their own transactions, goals, and view their personal dashboard. 
    Admins can also view user statistics and system health metrics. 
    Role-based access control ensures users only see features appropriate to their permission level.`,
    category: "admin",
    title: "User Roles"
  },
  {
    id: 14,
    content: `Finly uses Context API for global state management across the React application. 
    The AppContext provides access to user authentication state, theme preferences (light/dark mode), 
    user profile data, and announcements. Components can consume this context to access shared state 
    without prop drilling. The context also manages loading states and provides functions for 
    theme toggling and user session management.`,
    category: "technical",
    title: "State Management"
  }
];