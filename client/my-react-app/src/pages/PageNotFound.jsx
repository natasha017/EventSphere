import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between px-4 sm:px-6 lg:px-8">
      
      <header className="w-full max-w-7xl mx-auto pt-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded-lg p-1">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            E
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 text-lg leading-tight">EventSphere</span>
            <span className="text-xs text-slate-500 font-medium tracking-wide">Management</span>
          </div>
        </Link>
      </header>

      
      <main className="w-full max-w-xl mx-auto my-auto text-center py-12">
        <div className="relative mb-8">
       
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none" aria-hidden="true">
            <div className="w-64 h-64 bg-indigo-600 rounded-full blur-3xl"></div>
          </div>
       
          <h1 className="text-8xl sm:text-9xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 select-none">
            404
          </h1>
        </div>

       
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
          Oops! Page Not Found
        </h2>
        <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
          The page you're looking for doesn't exist, may have been moved, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 shadow-sm transition-all duration-200"
          >
            Back to Home
          </Link>
          <Link
            to="/expos"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-slate-300 text-base font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 shadow-sm transition-all duration-200"
          >
            Explore Expos
          </Link>
        </div>
      </main>

      
      <footer className="w-full max-w-7xl mx-auto pb-6 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} EventSphere Management. All rights reserved.
      </footer>
    </div>
  );
};

export default PageNotFound;