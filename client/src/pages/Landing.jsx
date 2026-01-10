import { Link } from "react-router-dom";

function Landing() {
  return (
    <div>
      {/* Navbar */}
      <nav className="flex justify-between p-6">
        <h1 className="font-bold text-xl">PCMS</h1>
        <div className="space-x-4">
          <Link to="/login">Login</Link>
          <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="p-10 text-center">
        <h2 className="text-3xl font-bold">
          Connecting People with <span className="text-blue-600">Trusted Professionals</span>
        </h2>
        <p className="mt-4 text-gray-600">
          Discover professionals, jobs, and achievements.
        </p>

        <div className="mt-6">
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-6 py-3 rounded mr-4"
          >
            Get Started
          </Link>
          <Link to="/login" className="text-blue-600 font-medium">
            Learn More →
          </Link>
        </div>
      </section>

      {/* Blog section + footer stays same */}
    </div>
  );
}

export default Landing;
