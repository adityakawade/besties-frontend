import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-50 px-4">

      <div className="text-center relative">

        {/* Background big 404 */}
        <h1 className="absolute inset-0 text-[120px] font-bold text-indigo-100 select-none">
          404
        </h1>

        {/* Content */}
        <div className="relative z-10 bg-white/70 backdrop-blur-lg p-10 rounded-2xl shadow-xl border border-gray-200">

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Page Not Found
          </h2>

          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            The page you’re looking for doesn’t exist or has been moved.
          </p>

          {/* Button */}
          <Link
            to="/"
            className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-md transition duration-200 active:scale-95 shadow-sm hover:shadow-md"
          >
            Back to Home
          </Link>

        </div>

      </div>
    </div>
  );
};

export default NotFound;