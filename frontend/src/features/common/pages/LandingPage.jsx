import {
  ArrowRightIcon,
  ArrowTrendingUpIcon,
  BoltIcon,
  CalendarDateRangeIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import AnimatedStats from "../components/AnimatedStats";
import { Carousel } from "../components/Carousel";
const carouselData = [
  {
    heading: "Income VS Expense Breakdown",
    graphType: "LineChart",
    data: [
      { period: "Jan", income: 4000, expense: 2400 },
      { period: "Feb", income: 3000, expense: 1398 },
      { period: "Mar", income: 2000, expense: 5000 },
      { period: "Apr", income: 2780, expense: 3908 },
    ],
  },
  {
    heading: "Source-wise Income Breakdown",
    graphType: "HorizontalBarChart",
    data: [
      { source: "Salary", amount: 4500 },
      { source: "Freelancing", amount: 1200 },
      { source: "Investments", amount: 5000 },
      { source: "Rent", amount: 6000 },
      { source: "Miscellaneous", amount: 2000 },
    ],
  },
  {
    heading: "Set your income goal",
    graphType: "GoalCard",
    data: {
      amount: 1000,
      currentAmount: 750,
      remaining: 250,
      type: "income",
    },
  },
  {
    heading: "Set your expense goal",
    graphType: "GoalCard",
    data: {
      amount: 1000,
      currentAmount: 1200,
      remaining: -200,
      type: "expense",
    },
  },
  {
    heading: "Monthly Income Trend",
    graphType: "BarChart",
    data: [
      { period: "2024-01-01", income: 3200 },
      { period: "2024-02-01", income: 4500 },
      { period: "2024-03-01", income: 4000 },
      { period: "2024-04-01", income: 4700 },
      { period: "2024-05-01", income: 5100 },
      { period: "2024-06-01", income: 4800 },
      { period: "2024-07-01", income: 5300 },
      { period: "2024-08-01", income: 4900 },
      { period: "2024-09-01", income: 5500 },
      { period: "2024-10-01", income: 6000 },
    ],
    type: "income",
    frequency: "monthly",
  },
  {
    heading: "Income vs Expense Trend",
    graphType: "BarChart",
    data: [
      { period: "2024-01-01", income: 3000, expense: 2000 },
      { period: "2024-02-01", income: 4000, expense: 2200 },
      { period: "2024-03-01", income: 3500, expense: 2700 },
      { period: "2024-04-01", income: 3800, expense: 2900 },
      { period: "2024-05-01", income: 4200, expense: 3100 },
      { period: "2024-06-01", income: 4600, expense: 3300 },
      { period: "2024-07-01", income: 5000, expense: 3600 },
      { period: "2024-08-01", income: 4800, expense: 3400 },
    ],
    type: "income",
    frequency: "monthly",
    showBoth: true,
  },
];
const features = [
  {
    icon: CalendarDateRangeIcon,
    title: "Smart Budgeting",
    desc: "Set goals and track progress effortlessly",
  },
  {
    icon: ChartBarIcon,
    title: "Visual Analytics",
    desc: "See where your money goes at a glance",
  },
  {
    icon: ArrowTrendingUpIcon,
    title: "Expense Tracking",
    desc: "Categorize and monitor spending patterns",
  },
  {
    icon: BoltIcon,
    title: "Real-time Insights",
    desc: "Get alerts when you exceed budget limits",
  },
];

export function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Hero Section  */}
      <section className="px-5 py-10 lg:px-10 lg:py-20 max-w-7xl mx-auto">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Smart Financial Tracking Made{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Simple
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl md:max-w-4xl">
            Take control of your finances with intelligent budgeting, real-time
            tracking, and actionable insights. Spend smart. Save smarter.
          </p>
          <button
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-8 py-3 rounded-lg font-semibold flex items-center justify-center cursor-pointer gap-2 transition-all transform hover:scale-105"
            onClick={() => navigate("/login")}
          >
            Get Started Free <ArrowRightIcon className="w-5 h-5" />
          </button>
          <p className="text-sm text-slate-500">
            No credit card required. Start free today.
          </p>
        </div>
        {/* container  */}
        <div className="relative h-96 lg:h-[500px] flex justify-center items-center mt-12">
          {/* background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl blur-3xl" />
          <Carousel carouselData={carouselData} />
          {/* graph-3(pie) */}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-6 lg:px-12 py-15 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Why Choose Finly?
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Everything you need to master your money in one intuitive platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50 rounded-xl p-6 hover:border-slate-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10"
            >
              <feature.icon className="text-blue-400 mb-4 w-10 h-10" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <AnimatedStats />
    </div>
  );
}
