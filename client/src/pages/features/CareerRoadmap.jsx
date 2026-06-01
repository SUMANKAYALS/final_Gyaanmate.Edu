import { Link } from "react-router-dom";
import {
  FaGraduationCap,
  FaLaptopCode,
  FaBrain,
  FaCloud,
  FaShieldAlt,
  FaMobileAlt,
  FaPalette,
  FaChartLine,
  FaRobot,
  FaDatabase,
  FaCheckCircle,
  FaClipboardList,
} from "react-icons/fa";
import FeaturePageShell from "../../components/features/FeaturePageShell";

const ROADMAPS = [
  {
    title: "Full-Stack Developer",
    icon: FaLaptopCode,
    color: "from-blue-500 to-cyan-500",
    difficulty: "Intermediate",
    salary: "₹6L - ₹20L",
    steps: [
      "HTML/CSS",
      "JavaScript",
      "React",
      "Node.js",
      "MongoDB",
      "Deployment",
    ],
  },
  {
    title: "Data Scientist",
    icon: FaBrain,
    color: "from-purple-500 to-pink-500",
    difficulty: "Advanced",
    salary: "₹8L - ₹30L",
    steps: [
      "Python",
      "Statistics",
      "Pandas",
      "Machine Learning",
      "Deep Learning",
      "MLOps",
    ],
  },
  {
    title: "Cloud Engineer",
    icon: FaCloud,
    color: "from-sky-500 to-indigo-500",
    difficulty: "Intermediate",
    salary: "₹7L - ₹25L",
    steps: [
      "Linux",
      "Networking",
      "AWS",
      "Docker",
      "Kubernetes",
      "Terraform",
    ],
  },
  {
    title: "Cyber Security",
    icon: FaShieldAlt,
    color: "from-red-500 to-orange-500",
    difficulty: "Advanced",
    salary: "₹8L - ₹35L",
    steps: [
      "Networking",
      "Linux",
      "Ethical Hacking",
      "Web Security",
      "Pen Testing",
      "SOC",
    ],
  },
  {
    title: "Mobile App Developer",
    icon: FaMobileAlt,
    color: "from-green-500 to-emerald-500",
    difficulty: "Intermediate",
    salary: "₹5L - ₹18L",
    steps: [
      "JavaScript",
      "React Native",
      "Flutter",
      "Firebase",
      "APIs",
      "Publishing",
    ],
  },
  {
    title: "UI/UX Designer",
    icon: FaPalette,
    color: "from-pink-500 to-rose-500",
    difficulty: "Beginner",
    salary: "₹4L - ₹15L",
    steps: [
      "Design Basics",
      "Figma",
      "Wireframing",
      "Prototyping",
      "User Research",
      "Portfolio",
    ],
  },
  {
    title: "AI Engineer",
    icon: FaRobot,
    color: "from-violet-500 to-purple-600",
    difficulty: "Advanced",
    salary: "₹10L - ₹40L",
    steps: [
      "Python",
      "Machine Learning",
      "Deep Learning",
      "LLMs",
      "RAG",
      "AI Deployment",
    ],
  },
  {
    title: "DevOps Engineer",
    icon: FaDatabase,
    color: "from-yellow-500 to-orange-500",
    difficulty: "Advanced",
    salary: "₹8L - ₹28L",
    steps: [
      "Linux",
      "Git",
      "Docker",
      "CI/CD",
      "Kubernetes",
      "Monitoring",
    ],
  },
  {
    title: "Business Analyst",
    icon: FaChartLine,
    color: "from-teal-500 to-cyan-500",
    difficulty: "Beginner",
    salary: "₹5L - ₹18L",
    steps: [
      "Excel",
      "SQL",
      "Power BI",
      "Data Analysis",
      "Reporting",
      "Stakeholder Mgmt",
    ],
  },
  {
  title: "Machine Learning Engineer",
  icon: FaRobot,
  color: "from-purple-500 to-pink-500",
  difficulty: "Advanced",
  salary: "₹10L - ₹40L",
  steps: [
    "Python",
    "Statistics",
    "Linear Algebra",
    "Scikit-Learn",
    "Machine Learning",
    "Deep Learning",
    "TensorFlow/PyTorch",
    "MLOps"
  ]
},
{
  title: "Blockchain Developer",
  icon: FaDatabase,
  color: "from-yellow-500 to-orange-500",
  difficulty: "Advanced",
  salary: "₹8L - ₹35L",
  steps: [
    "JavaScript",
    "Cryptography Basics",
    "Ethereum",
    "Solidity",
    "Smart Contracts",
    "Web3.js",
    "DApps",
    "Security Auditing"
  ]
},
{
  title: "QA Engineer",
  icon: FaCheckCircle,
  color: "from-green-500 to-emerald-500",
  difficulty: "Beginner",
  salary: "₹4L - ₹15L",
  steps: [
    "Testing Fundamentals",
    "Manual Testing",
    "API Testing",
    "Selenium",
    "Automation Testing",
    "CI/CD Testing"
  ]
},
{
  title: "Product Manager",
  icon: FaClipboardList,
  color: "from-cyan-500 to-blue-500",
  difficulty: "Intermediate",
  salary: "₹10L - ₹35L",
  steps: [
    "Product Thinking",
    "Market Research",
    "User Stories",
    "Agile",
    "Analytics",
    "Roadmapping",
    "Stakeholder Management"
  ]
},
];

export default function CareerRoadmap() {
  return (
    <FeaturePageShell
      title="Career Roadmaps"
      subtitle="Choose your dream career and follow a structured path to success."
      icon={FaGraduationCap}
    >
      {/* Hero */}
      <div className="mb-10 text-center">
        <div className="inline-flex px-5 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-sm">
          🚀 Explore 9 Professional Career Paths
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-white mt-5">
          Your Future Starts Here
        </h2>

        <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
          Follow industry-proven learning roadmaps designed to help you land
          internships, jobs, and freelance opportunities faster.
        </p>
      </div>

      {/* Roadmaps */}
      <div className="grid lg:grid-cols-2 gap-6">
        {ROADMAPS.map((roadmap) => {
          const Icon = roadmap.icon;

          return (
            <div
              key={roadmap.title}
              className="group relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/50 backdrop-blur-sm hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-500/10"
            >
              {/* Gradient Header */}
              <div
                className={`h-2 bg-gradient-to-r ${roadmap.color}`}
              />

              <div className="p-6">
                {/* Top Section */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-r ${roadmap.color} flex items-center justify-center text-white text-xl shadow-lg`}
                    >
                      <Icon />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {roadmap.title}
                      </h3>

                      <p className="text-slate-400 text-sm">
                        {roadmap.salary}
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 text-xs rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    {roadmap.difficulty}
                  </span>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  {roadmap.steps.map((step, index) => (
                    <div
                      key={step}
                      className="flex items-center gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full bg-gradient-to-r ${roadmap.color} text-white text-sm font-bold flex items-center justify-center`}
                        >
                          {index + 1}
                        </div>

                        {index !== roadmap.steps.length - 1 && (
                          <div className="w-[2px] h-6 bg-slate-700 mt-1" />
                        )}
                      </div>

                      <span className="text-slate-300">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Glow Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${roadmap.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              />
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-10 text-center">
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold hover:scale-105 transition-all shadow-lg shadow-violet-500/20"
        >
          Explore Learning Courses 🚀
        </Link>
      </div>
    </FeaturePageShell>
  );
}