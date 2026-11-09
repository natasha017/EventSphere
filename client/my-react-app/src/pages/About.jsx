import React from "react";
import { Link } from "react-router-dom";
import {
  Layers,
  Calendar,
  Users,
  Clock,
  BarChart3,
  ShieldCheck,
  Compass,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Target,
  Layout,
  Briefcase,
  Cpu
} from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Calendar,
      title: "Expo Management",
      description: "Organize expo details, including titles, descriptions, themes, venues, dates, and event statuses."
    },
    {
      icon: Users,
      title: "Exhibitor Management",
      description: "Support exhibitor applications, registration review, approval workflows, and booth assignment where implemented."
    },
    {
      icon: Clock,
      title: "Schedule Management",
      description: "Organize event sessions, time slots, speakers, topics, and locations according to the available application functionality."
    },
    {
      icon: Compass,
      title: "Attendee Experience",
      description: "Provide attendees with access to relevant expo information and structured event schedules."
    },
    {
      icon: BarChart3,
      title: "Analytics and Reports",
      description: "Present event performance information and engagement insights when these features are supported by the application."
    },
    {
      icon: Layout,
      title: "Centralized Information",
      description: "Bring important event details into one organized digital platform to eliminate scattered communications."
    }
  ];

  const objectives = [
    "Reduce reliance on manual expo management processes and paperwork.",
    "Organize event information in a centralized digital platform.",
    "Improve the management of exhibitor applications and booth assignments.",
    "Make schedules and event updates easier to manage and distribute.",
    "Provide separate, appropriate experiences for administrators, exhibitors, and attendees.",
    "Create a responsive, accessible, and modern user interface.",
    "Build a modular application that can be extended as project requirements grow."
  ];

  const participants = [
    {
      icon: ShieldCheck,
      title: "Organizers and Administrators",
      description: "Manage expos, review exhibitor applications, organize schedules, and oversee event information according to assigned permissions."
    },
    {
      icon: Briefcase,
      title: "Exhibitors",
      description: "Apply to participate in expos, track application status, and access booth information when these features are implemented."
    },
    {
      icon: Users,
      title: "Attendees",
      description: "Discover upcoming expos and access relevant event details, timelines, and session schedules."
    }
  ];

  const techStack = [
    { name: "MongoDB", description: "Flexible NoSQL database storage for event and user data." },
    { name: "Express.js", description: "Fast backend web application framework for Node.js." },
    { name: "React", description: "Dynamic component-driven user interface library." },
    { name: "Node.js", description: "Reliable JavaScript runtime environment for server-side logic." },
    { name: "Tailwind CSS", description: "Utility-first CSS framework for clean, responsive UI." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
        {/* Glow Effects */}
        <div className="absolute top-1/4 -left-32 w-80 sm:w-96 h-80 sm:h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-32 w-80 sm:w-96 h-80 sm:h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold bg-indigo-500/15 text-indigo-300 px-4 py-2 rounded-full border border-indigo-500/30 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 flex-shrink-0 text-indigo-400" />
              <span>About EventSphere Management</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Transforming <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400 bg-clip-text text-transparent">Expo Management</span>
            </h1>
            
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              EventSphere Management simplifies expo and trade show administration by bringing organizers, exhibitors, and attendees together into one centralized, high-performance platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/expos"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-xl shadow-indigo-600/30 transition-all duration-200 transform hover:-translate-y-0.5 text-base"
              >
                <span>Explore Expos</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-4 bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold rounded-xl border border-slate-700 backdrop-blur-sm transition-all duration-200 text-base"
              >
                <span>Contact Us</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-6 relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 to-violet-600/10 rounded-3xl pointer-events-none" />
              <div className="flex items-center space-x-4 relative z-10">
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 flex-shrink-0">
                  <Layers className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">EventSphere Portal</h3>
                  <p className="text-xs sm:text-sm text-indigo-300 font-medium">Unified Exhibition Platform</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed relative z-10">
                Streamlining registrations, exhibitor coordination, scheduling, and participant workflows through a modern web interface.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-center relative z-10">
                <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                  <span className="block text-xl sm:text-2xl font-extrabold text-indigo-400">MERN</span>
                  <span className="block text-xs text-slate-400 mt-1 font-medium">Tech Stack</span>
                </div>
                <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                  <span className="block text-xl sm:text-2xl font-extrabold text-violet-400">100%</span>
                  <span className="block text-xs text-slate-400 mt-1 font-medium">Responsive UI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Our Story and Purpose */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-sm border border-slate-200/80 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold bg-indigo-50 text-indigo-700 px-3.5 py-1.5 rounded-full border border-indigo-100">
              <Compass className="h-4 w-4 text-indigo-600" />
              <span>Our Story & Purpose</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Solving Fragmentation in Event Management
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Traditional expo management often involves manual registrations, disconnected communication channels, difficulty accessing updated event information, and challenges organizing exhibitors and schedules.
            </p>
            <p className="text-slate-600 text-base leading-relaxed">
              EventSphere was developed to address these inefficiencies by providing a more organized digital experience, bringing important event management activities together into a single cohesive platform.
            </p>
          </div>

          <div className="lg:col-span-6 bg-slate-50/80 p-6 sm:p-8 rounded-2xl border border-slate-200/60 space-y-5">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">Why EventSphere?</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3.5">
                <CheckCircle2 className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-slate-700 font-medium">Centralized hub for organizers, exhibitors, and attendees.</span>
              </li>
              <li className="flex items-start space-x-3.5">
                <CheckCircle2 className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-slate-700 font-medium">Streamlined registration and structured scheduling tools.</span>
              </li>
              <li className="flex items-start space-x-3.5">
                <CheckCircle2 className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-slate-700 font-medium">Clean, responsive user interface built for mobile & desktop.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Our Mission */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
        <div className="max-w-7xl mx-auto text-center space-y-10 sm:space-y-16 relative z-10">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold bg-indigo-500/15 text-indigo-300 px-4 py-1.5 rounded-full border border-indigo-500/30">
              <Target className="h-4 w-4" />
              <span>Our Core Mission</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Simplifying Event Management
            </h2>
            <blockquote className="text-slate-300 text-base sm:text-xl leading-relaxed italic font-normal">
              "Our mission is to simplify expo management through technology, improve communication between event participants, and make event information easier to access."
            </blockquote>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
            {[
              "Simplify event organization workflows.",
              "Improve communication between organizers, exhibitors, and attendees.",
              "Make event schedules and information easier to access.",
              "Support more organized event participation.",
              "Provide a convenient digital event management experience."
            ].map((goal, index) => (
              <div key={index} className="bg-slate-800/90 hover:bg-slate-800 transition-colors duration-200 p-6 rounded-2xl border border-slate-700/80 flex items-start space-x-4 shadow-sm">
                <div className="h-7 w-7 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-slate-200 leading-snug">{goal}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. What EventSphere Offers */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            What We Do
          </h2>
          <p className="text-slate-600 text-base">
            Explore the core features and functional modules built into EventSphere Management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/80 flex flex-col space-y-4 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Project Objectives */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Our Project Objectives
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              EventSphere was built with clear structural goals to ensure maintainability, scalability, and an intuitive user journey for all participants.
            </p>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {objectives.map((obj, index) => (
              <div key={index} className="bg-slate-50 p-5 rounded-2xl border border-slate-200/70 flex items-start space-x-3.5 shadow-sm">
                <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                  {index + 1}
                </div>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">{obj}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Who Uses EventSphere? */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built for Every Event Participant
          </h2>
          <p className="text-slate-600 text-base">
            Tailored experiences designed for organizers, exhibitors, and attendees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {participants.map((p, index) => {
            const Icon = p.icon;
            return (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/80 space-y-4 hover:shadow-lg transition-all duration-300">
                <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{p.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{p.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Technology Stack */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold bg-indigo-500/15 text-indigo-300 px-4 py-1.5 rounded-full border border-indigo-500/30">
              <Cpu className="h-4 w-4" />
              <span>Tech Stack</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Built with Modern Web Technologies
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              EventSphere Management relies on the MERN stack and Tailwind CSS for performance and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {techStack.map((tech, index) => (
              <div key={index} className="bg-slate-800/90 p-6 rounded-2xl border border-slate-700/80 text-left space-y-2 shadow-sm">
                <h3 className="text-lg font-bold text-indigo-400">{tech.name}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Call-to-Action */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-indigo-950 text-white relative overflow-hidden border-t border-slate-800">
        <div className="absolute inset-0 bg-indigo-600/5 blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to Explore EventSphere?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Discover upcoming expos, explore opportunities, and experience a more organized approach to event participation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/expos"
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-xl shadow-indigo-600/30 transition-all text-center text-base"
            >
              Explore Expos
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-slate-800/90 hover:bg-slate-700/90 text-white font-semibold rounded-xl border border-slate-700 transition-all text-center text-base"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;