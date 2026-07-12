import type {
  CoursePackage,
  Instructor,
  Testimonial,
  ProcessStep,
  DashboardCourse,
  ChartDataPoint,
} from "./types";

export const stats = [
  { label: "Students Enrolled", value: 200000, suffix: "+", prefix: "", display: "2 Lakh+" },
  { label: "Expert Trainers", value: 100, suffix: "+", prefix: "", display: "100+" },
  { label: "Live Trainings", value: 500, suffix: "+", prefix: "", display: "500+" },
  { label: "Community Earnings", value: 70, suffix: " Cr+", prefix: "₹", display: "₹70 Cr+" },
];

export const coursePackages: CoursePackage[] = [
  {
    id: "bronze",
    name: "Bronze Bundle",
    price: 1899,
    originalPrice: 2500,
    courses: 4,
    hours: 21,
    enrollments: "140K+",
    features: ["Live Q&A Support", "140K+ Students Enrolled", "LeadGuruTeach Certificate"],
    gradient: "from-amber-600/20 to-orange-600/20",
  },
  {
    id: "silver",
    name: "Silver Package",
    price: 3499,
    originalPrice: 3999,
    courses: 14,
    hours: 52,
    enrollments: "90K+",
    features: ["Live Q&A Support", "90K+ Students Enrolled", "LeadGuruTeach Certificate"],
    gradient: "from-slate-400/20 to-slate-600/20",
  },
  {
    id: "gold",
    name: "Gold Package",
    price: 6999,
    originalPrice: 7999,
    courses: 23,
    hours: 70,
    enrollments: "70K+",
    features: ["Live Q&A Support", "70K+ Students Enrolled", "LeadGuruTeach Certificate"],
    gradient: "from-yellow-500/20 to-amber-600/20",
    popular: true,
  },
  {
    id: "platinum",
    name: "Platinum Package",
    price: 12999,
    originalPrice: 13999,
    courses: 25,
    hours: 83,
    enrollments: "50K+",
    features: ["Live Q&A Support", "50K+ Students Enrolled", "LeadGuruTeach Certificate"],
    gradient: "from-cyan-400/20 to-blue-500/20",
  },
  {
    id: "diamond",
    name: "Diamond Package",
    price: 19999,
    originalPrice: 29999,
    courses: 28,
    hours: 96,
    enrollments: "20K+",
    features: ["Live Q&A Support", "20K+ Students Enrolled", "LeadGuruTeach Certificate"],
    gradient: "from-purple-500/20 to-indigo-600/20",
  },
  {
    id: "startup",
    name: "Startup Package",
    price: 29999,
    originalPrice: 49999,
    courses: 32,
    hours: 100,
    enrollments: "20K+",
    features: ["Live Q&A Support", "20K+ Students Enrolled", "LeadGuruTeach Certificate"],
    gradient: "from-emerald-500/20 to-teal-600/20",
  },
];

export const processSteps: ProcessStep[] = [
  {
    id: "educate",
    title: "Educate",
    description: "Learn from the best trainers in the industry with live sessions and expert guidance.",
    lottieUrl: "https://assets1.lottiefiles.com/packages/lf20_iorpbol0.json",
  },
  {
    id: "innovate",
    title: "Innovate",
    description: "Attain sought-after knowledge and skills for your professional growth and success.",
    lottieUrl: "https://assets1.lottiefiles.com/packages/lf20_49rdyysj.json",
  },
  {
    id: "dominate",
    title: "Dominate",
    description: "Make an impact with industry-leading training programs and affiliate earnings.",
    lottieUrl: "https://assets1.lottiefiles.com/packages/lf20_zrqthn6o.json",
  },
];

export const instructors: Instructor[] = [
  { id: "1", name: "Srijan Mitra", title: "Video Editing Coach", avatar: "SM" },
  { id: "2", name: "Sapna Patheja", title: "Mind & Life Coach", avatar: "SP" },
  { id: "3", name: "Rahul Jain", title: "Business Strategist", avatar: "RJ" },
  { id: "4", name: "Jai Purohit", title: "Sales Expert", avatar: "JP" },
  { id: "5", name: "Ashu Gandhi", title: "Digital Marketer", avatar: "AG" },
  { id: "6", name: "Shruti Lohariwal", title: "Freelancer Instructor", avatar: "SL" },
  { id: "7", name: "Karan Rana", title: "Productivity Coach", avatar: "KR" },
  { id: "8", name: "Shivam", title: "Emotional Intelligence Coach", avatar: "SH" },
  { id: "9", name: "Rahul Bansal", title: "Content Creator", avatar: "RB" },
  { id: "10", name: "Saud Siraj", title: "Self-Development Coach", avatar: "SS" },
  { id: "11", name: "Sachin Thakur", title: "English Speaking Coach", avatar: "ST" },
  { id: "12", name: "Abhay Ranjan", title: "Digital Marketing Specialist", avatar: "AR" },
  { id: "13", name: "Shraddha Shrivastava", title: "LinkedIn Coach", avatar: "SS" },
  { id: "14", name: "Abhishek Vishnoi", title: "English Fluency Coach", avatar: "AV" },
  { id: "15", name: "Taiba Mehmood", title: "Storytelling Expert", avatar: "TM" },
  { id: "16", name: "Vinit Aggarwal", title: "Stock Market Trainer", avatar: "VA" },
  { id: "17", name: "Rajat Mathur", title: "Career & Interview Coach", avatar: "RM" },
  { id: "18", name: "Avi Arya", title: "Digital Marketing Expert", avatar: "AA" },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote: "The best platform I have ever used in this industry. And the best thing is same day payout!",
    name: "Ishika Pandey",
    role: "Student",
    rating: 5,
  },
  {
    id: "2",
    quote: "LeadGuruTeach helped me remain updated with recent trends and advancements. Now there is no looking back.",
    name: "Ananya Sharma",
    role: "Student",
    rating: 5,
  },
  {
    id: "3",
    quote: "If you are a newbie or an expert, LeadGuruTeach has covered everything under one roof for skill development.",
    name: "Ravi Pandey",
    role: "Student",
    rating: 5,
  },
  {
    id: "4",
    quote: "This platform helped me overcome my fears and make the most out of given opportunities.",
    name: "Deepak Saini",
    role: "Student",
    rating: 5,
  },
  {
    id: "5",
    quote: "LeadGuruTeach has completely transformed my life and helped me become the best version of myself.",
    name: "Arun Shaoo",
    role: "Student",
    rating: 5,
  },
  {
    id: "6",
    quote: "I used to struggle with communication. LeadGuruTeach helped me improve and become efficient in discussions.",
    name: "Priyanka Sharma",
    role: "Student",
    rating: 5,
  },
];

export const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#courses", label: "Courses" },
  { href: "#mentors", label: "Mentors" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#affiliate", label: "Affiliate" },
];

export const dashboardCourses: DashboardCourse[] = [
  {
    id: "1",
    title: "Digital Marketing Mastery",
    progress: 78,
    totalLessons: 45,
    completedLessons: 35,
    gradient: "from-purple-vibrant to-cyan-neon",
  },
  {
    id: "2",
    title: "LinkedIn Personal Branding",
    progress: 45,
    totalLessons: 32,
    completedLessons: 14,
    gradient: "from-blue-500 to-cyan-neon",
  },
  {
    id: "3",
    title: "Public Speaking Excellence",
    progress: 92,
    totalLessons: 28,
    completedLessons: 26,
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    id: "4",
    title: "Affiliate Marketing Pro",
    progress: 23,
    totalLessons: 40,
    completedLessons: 9,
    gradient: "from-orange-500 to-pink-500",
  },
];

export const earningsChartData: ChartDataPoint[] = [
  { day: "Mon", earnings: 1200 },
  { day: "Tue", earnings: 1800 },
  { day: "Wed", earnings: 1500 },
  { day: "Thu", earnings: 2200 },
  { day: "Fri", earnings: 2800 },
  { day: "Sat", earnings: 3200 },
  { day: "Sun", earnings: 4100 },
];

export const SPLINE_SCENE_URL =
  "https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode";
