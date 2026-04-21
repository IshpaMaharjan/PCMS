import { useNavigate } from "react-router-dom";
import { Users, Briefcase, Award, Calendar, FileText, MessageCircle } from "lucide-react";

function Landing() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleGetStarted = () => {
    if (token) navigate("/dashboard");
    else navigate("/signup");
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">
      {/* HERO */}
      <section className="px-6 md:px-10 py-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="text-5xl font-extrabold text-gray-900 leading-tight">
              Connecting People with <br />
              <span className="text-blue-600">Trusted Professionals</span>
            </h2>
            <p className="mt-6 text-gray-600 max-w-lg text-lg">
              Profession Connection Management System (PCMS) bridges users
              and verified professionals through a unified digital platform.
            </p>
            <div className="mt-10 flex gap-4">
              <button
                onClick={handleGetStarted}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1"
              >
                Get Started
              </button>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-2xl p-10 max-w-md justify-self-end">
            <div className="flex justify-center mb-8">
              <div className="bg-blue-100 text-blue-600 p-6 rounded-full shadow-inner">
                <Users size={34} />
              </div>
            </div>
            <ul className="space-y-5 text-gray-700">
              <li className="flex gap-3 items-center">
                <Award size={20} /> Verified Experts
              </li>
              <li className="flex gap-3 items-center">
                <Briefcase size={20} /> Vacancies
              </li>
              <li className="flex gap-3 items-center">
                <Users size={20} /> Achievements
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 md:px-10 py-20">
        <h3 className="text-center text-3xl font-bold mb-14 text-gray-800">
          What PCMS Offers
        </h3>
        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          <FeatureCard icon={<Users size={26} />} title="Connect Professionals" desc="Find and connect with verified professionals in your industry." />
          <FeatureCard icon={<Briefcase size={26} />} title="Manage Appointments" desc="Schedule and track your professional meetings effortlessly." />
          <FeatureCard icon={<Calendar size={26} />} title="Feed & Updates" desc="Stay updated with industry news and professional posts." />
          <FeatureCard icon={<FileText size={26} />} title="Profile Management" desc="Maintain your profile, skills, and professional portfolio." />
          <FeatureCard icon={<MessageCircle size={26} />} title="Rating" desc="Client can rate professionals based on their experience." />
          <FeatureCard icon={<FileText size={26} />} title="Generate Resume" desc="Create a professional resume quickly using your profile info." />
        </div>
      </section>

      {/* INSIGHTS */}
      <section className="px-6 md:px-10 py-20 bg-gray-50">
        <h3 className="text-center text-3xl font-bold mb-14 text-gray-800">PCMS Insights</h3>
        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          <BlogCard title="Building Professional Networks" tag="NETWORKING" desc="Strategies for creating meaningful professional connections." />
          <BlogCard title="Top Skills in Demand" tag="CAREER" desc="Skills professionals must develop in the modern workforce." />
          <BlogCard title="Student to Professional" tag="SUCCESS" desc="Success stories from PCMS community members." />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 md:px-10 py-24">
        <h3 className="text-center text-3xl font-bold mb-16 text-gray-800">How PCMS Works</h3>
        <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <StepCard step="1" title="Sign Up" desc="Create your account." />
          <StepCard step="2" title="Complete Profile" desc="Add skills, experience, and portfolio." />
          <StepCard step="3" title="Discover & Connect" desc="Find professionals or services and connect." />
          <StepCard step="4" title="Manage & Grow" desc="Schedule meetings, track updates, and grow your network." />
        </div>
      </section>
    </div>
  );
}

export default Landing;

// ---------------- FEATURE CARD ----------------
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="group bg-white border border-gray-200 p-6 rounded-2xl shadow-md hover:shadow-2xl transition cursor-pointer hover:-translate-y-2">
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-600 text-white mb-4 group-hover:scale-110 transition">
        {icon}
      </div>
      <h4 className="font-semibold text-lg text-gray-800">{title}</h4>
      <p className="text-gray-600 text-sm mt-2">{desc}</p>
    </div>
  );
}

// ---------------- BLOG CARD ----------------
function BlogCard({ title, tag, desc }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition cursor-pointer hover:-translate-y-2">
      <span className="text-xs text-blue-600 font-semibold tracking-wide">{tag}</span>
      <h4 className="mt-3 font-semibold text-gray-800">{title}</h4>
      <p className="mt-2 text-sm text-gray-600">{desc}</p>
    </div>
  );
}

// ---------------- STEP CARD ----------------
function StepCard({ step, title, desc }) {
  return (
    <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-md hover:shadow-2xl transition text-center hover:-translate-y-2">
      <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-blue-600 text-white font-bold mb-4 text-lg shadow-md">
        {step}
      </div>
      <h4 className="font-semibold mb-2 text-gray-800">{title}</h4>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  );
}
