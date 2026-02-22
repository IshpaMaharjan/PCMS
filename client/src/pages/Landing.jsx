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
    <div className="w-full min-h-screen bg-white">
      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 px-10 py-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">
              Connecting People with <br />
              <span className="text-blue-600">Trusted Professionals</span>
            </h2>
            <p className="mt-5 text-gray-600 max-w-lg">
              Profession Connection Management System (PCMS) bridges users
              and verified professionals through a unified digital platform.
            </p>
            <div className="mt-8 flex gap-4">
              <button
                onClick={handleGetStarted}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 shadow-lg transition"
              >
                Get Started
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md justify-self-end">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 text-blue-600 p-5 rounded-full">
              <Users size={32} />
            </div>
          </div>
          <ul className="space-y-4 text-sm md:text-base text-gray-700">
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

      {/* FEATURES / SERVICES */}
      <section className="px-10 py-20 bg-gray-50">
        <h3 className="text-center text-3xl font-bold mb-10">What PCMS Offers</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <FeatureCard
            icon={<Users size={24} className="text-white" />}
            title="Connect Professionals"
            desc="Find and connect with verified professionals in your industry."
            color="bg-blue-600"
          />
          <FeatureCard
            icon={<Briefcase size={24} className="text-white" />}
            title="Manage Appointments"
            desc="Schedule and track your professional meetings effortlessly."
            color="bg-green-600"
          />
          <FeatureCard
            icon={<Calendar size={24} className="text-white" />}
            title="Feed & Updates"
            desc="Stay updated with industry news and professional posts."
            color="bg-purple-600"
          />
          <FeatureCard
            icon={<FileText size={24} className="text-white" />}
            title="Profile Management"
            desc="Maintain your profile, skills, and professional portfolio."
            color="bg-yellow-500"
          />
          <FeatureCard
            icon={<MessageCircle size={24} className="text-white" />}
            title="Messaging"
            desc="Communicate directly with your connections securely."
            color="bg-pink-500"
          />
          <FeatureCard
            icon={<FileText size={24} className="text-white" />}
            title="Generate Resume"
            desc="Create a professional resume quickly using your profile info."
            color="bg-indigo-600"
          />
        </div>
      </section>

      {/* INSIGHTS / TIPS SECTION */}
      <section className="px-10 py-20">
        <h3 className="text-center text-3xl font-bold mb-10">PCMS Insights</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <BlogCard
            title="Building Professional Networks"
            tag="NETWORKING"
            desc="Strategies for creating meaningful professional connections."
          />
          <BlogCard
            title="Top Skills in Demand"
            tag="CAREER"
            desc="Skills professionals must develop in the modern workforce."
          />
          <BlogCard
            title="Student to Professional"
            tag="SUCCESS"
            desc="Success stories from PCMS community members."
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-10 py-20 bg-gradient-to-tr from-blue-50 to-blue-100">
        <h3 className="text-center text-3xl font-bold mb-10">How PCMS Works</h3>
        <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <StepCard step="1" title="Sign Up" desc="Create your account and get verified." />
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
function FeatureCard({ icon, title, desc, color }) {
  return (
    <div className={`flex flex-col items-start gap-4 p-6 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer ${color}`}>
      <div className="p-3 rounded-full bg-opacity-25">{icon}</div>
      <h4 className="text-white font-semibold text-lg">{title}</h4>
      <p className="text-white text-sm">{desc}</p>
    </div>
  );
}

// ---------------- BLOG CARD ----------------
function BlogCard({ title, tag, desc }) {
  return (
    <div className="border rounded-xl p-5 hover:shadow-lg transition cursor-pointer">
      <span className="text-xs text-blue-600 font-semibold">{tag}</span>
      <h4 className="mt-2 font-semibold">{title}</h4>
      <p className="mt-2 text-sm text-gray-600">{desc}</p>
    </div>
  );
}

// ---------------- STEP CARD ----------------
function StepCard({ step, title, desc }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition text-center">
      <div className="w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-blue-600 text-white font-bold mb-4">
        {step}
      </div>
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  );
}
