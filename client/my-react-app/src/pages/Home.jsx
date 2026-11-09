
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Users,
  Building2,
  Briefcase,
  ArrowRight,
  Sparkles,
  Compass,
  Layers,
  Clock,
  ShieldCheck,
  MapPin,
  CalendarDays,
  ChevronRight,
  TrendingUp,
  Award,
  Globe,
} from "lucide-react";

import api from "../../api/axios";

const Home = () => {
  const [expos, setExpos] = useState([]);
  const [loadingExpos, setLoadingExpos] = useState(true);
  const [error, setError] = useState("");

  // Fetch published expos
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoadingExpos(true);
        setError("");

        const response = await api.get("/events/published");

        const events = response.data.events || [];

        setExpos(Array.isArray(events) ? events : []);
      } catch (error) {
        console.error("Error fetching homepage expos:", error);
        setError("Unable to load expos. Please try again later.");
      } finally {
        setLoadingExpos(false);
      }
    };

    fetchHomeData();
  }, []);

  // Format date
  const formatDate = (date) => {
    if (!date) return "Date TBA";

    const formattedDate = new Date(date);

    if (Number.isNaN(formattedDate.getTime())) {
      return "Date TBA";
    }

    return formattedDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // FIX: Generate correct backend image URL
  const getImageSrc = (imagePath) => {
    if (!imagePath) return "";

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    const baseURL = api.defaults.baseURL || "";

    // Remove /api from backend URL
    const serverUrl = baseURL.replace(/\/api\/?$/, "");

    return `${serverUrl}/${imagePath.replace(/^\//, "")}`;
  };

  // Featured expos
  const featuredExpos = expos.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-x-hidden selection:bg-indigo-500 selection:text-white">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-20 sm:py-28 lg:py-36 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">

        <div className="absolute top-1/4 -left-32 w-80 sm:w-96 h-80 sm:h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="absolute bottom-10 -right-32 w-80 sm:w-96 h-80 sm:h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">

          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">

            <div className="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold bg-indigo-500/15 text-indigo-300 px-4 py-2 rounded-full border border-indigo-500/30 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>Welcome to EventSphere Management</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Discover.{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400 bg-clip-text text-transparent">
                Connect.
              </span>{" "}
              Experience.
            </h1>

            <p className="text-lg sm:text-xl font-medium text-indigo-200/90 tracking-wide">
              Your Complete Expo Management Experience
            </p>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
              EventSphere connects organizers, exhibitors, and attendees
              through one centralized platform designed for modern expos
              and trade shows.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">

              <Link
                to="/expos"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-xl shadow-indigo-600/30 transition-all duration-200 hover:-translate-y-0.5 text-base"
              >
                <span>Explore Expos</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold rounded-xl border border-slate-700 backdrop-blur-sm transition-all duration-200 text-base"
              >
                <span>Learn More</span>
              </Link>

            </div>
          </div>

          {/* HERO SIDE CARD */}
          <div className="lg:col-span-5 flex justify-center">

            <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-6 relative">

              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 to-violet-600/10 rounded-3xl pointer-events-none" />

              <div className="flex items-center gap-4 relative z-10">

                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                  <Globe className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">
                    EventSphere Platform
                  </h3>

                  <p className="text-xs sm:text-sm text-indigo-300 font-medium">
                    Expo & Trade Show Management
                  </p>
                </div>

              </div>

              <p className="text-sm text-slate-300 leading-relaxed relative z-10">
                Organize exhibitions, manage exhibitor applications,
                allocate booths, and keep event schedules organized
                in one convenient platform.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-center relative z-10">

                <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                  <span className="block text-lg sm:text-xl font-extrabold text-indigo-400">
                    Expos & Fairs
                  </span>
                  <span className="block text-xs text-slate-400 mt-1 font-medium">
                    Event Management
                  </span>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                  <span className="block text-lg sm:text-xl font-extrabold text-violet-400">
                    Exhibitors
                  </span>
                  <span className="block text-xs text-slate-400 mt-1 font-medium">
                    Business Profiles
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* PLATFORM HIGHLIGHTS */}
      <section className="py-12 bg-white border-b border-slate-200/80 shadow-sm">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">

            {[
              {
                icon: Calendar,
                title: "Expo Management",
                description: "Organized Events",
              },
              {
                icon: Building2,
                title: "Exhibitors",
                description: "Company Profiles",
              },
              {
                icon: Users,
                title: "Attendees",
                description: "Event Discovery",
              },
              {
                icon: TrendingUp,
                title: "Event Schedules",
                description: "Organized Sessions",
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-100"
                >
                  <div className="h-10 w-10 mx-auto mb-3 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                    {item.description}
                  </p>
                </div>
              );
            })}

          </div>
        </div>
      </section>

      {/* FEATURED EXPOS */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 sm:mb-14 gap-4">

          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold bg-indigo-50 text-indigo-700 px-3.5 py-1.5 rounded-full border border-indigo-100 mb-3">
              <CalendarDays className="h-4 w-4 text-indigo-600" />
              <span>Upcoming Exhibitions</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Featured Expos
            </h2>
          </div>

          <Link
            to="/expos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition group"
          >
            <span>View All Expos</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

        </div>

        {/* LOADING */}
        {loadingExpos ? (

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-96 rounded-3xl bg-slate-200 animate-pulse"
              />
            ))}

          </div>

        ) : error ? (

          <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center">
            <p className="text-red-600 font-medium">{error}</p>
          </div>

        ) : featuredExpos.length === 0 ? (

          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">

            <Building2 className="mx-auto h-12 w-12 text-slate-300" />

            <h3 className="mt-4 text-lg font-semibold text-slate-800">
              No expos available
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Check back soon for upcoming trade shows and exhibitions.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">

            {featuredExpos.map((expo) => (

              <div
                key={expo._id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >

                {/* EXPO IMAGE */}
                <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">

                  {expo.image ? (
                    <img
                      src={getImageSrc(expo.image)}
                      alt={expo.title || "Expo"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                      <CalendarDays className="h-12 w-12 opacity-80" />
                    </div>
                  )}

                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-indigo-700 shadow-sm">
                    {expo.status || "Published"}
                  </div>

                </div>

                {/* EXPO DETAILS */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">

                  <div className="space-y-3">

                    <div className="flex flex-wrap items-center text-xs text-slate-500 gap-3">

                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5 text-indigo-600" />
                        {formatDate(expo.startDate)}
                      </span>

                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-indigo-600" />
                        {expo.location || "Location TBA"}
                      </span>

                    </div>

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {expo.title}
                    </h3>

                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {expo.description || "No description available."}
                    </p>

                  </div>

                  <div className="pt-4 border-t border-slate-100">

                    <Link
                      to={`/expos/${expo._id}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-semibold text-sm transition-all duration-200"
                    >
                      <span>View Details</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                  </div>

                </div>
              </div>

            ))}

          </div>
        )}

      </section>

      {/* WHY CHOOSE EVENTSPHERE */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200/80">

        <div className="max-w-7xl mx-auto">

          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">

            <div className="inline-flex items-center gap-2 text-xs font-semibold bg-indigo-50 text-indigo-700 px-3.5 py-1.5 rounded-full border border-indigo-100">
              <Award className="h-4 w-4 text-indigo-600" />
              <span>Platform Benefits</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why Choose EventSphere?
            </h2>

            <p className="text-slate-600 text-base">
              Everything you need to organize expos and trade shows
              in one centralized platform.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

            {[
              {
                icon: Calendar,
                title: "Easy Expo Management",
                description:
                  "Create, manage, and publish expos with venues, themes, descriptions, and event dates.",
              },
              {
                icon: Briefcase,
                title: "Exhibitor Applications",
                description:
                  "Manage exhibitor submissions, review applications, update statuses, and assign booths.",
              },
              {
                icon: Clock,
                title: "Organized Event Schedules",
                description:
                  "Create and manage event sessions with descriptions and scheduled start and end times.",
              },
              {
                icon: Layers,
                title: "Centralized Information",
                description:
                  "Keep expo details, exhibitor profiles, and important event information organized.",
              },
              {
                icon: ShieldCheck,
                title: "Role-Based Access",
                description:
                  "Provide separate experiences for administrators, exhibitors, and attendees.",
              },
              {
                icon: Compass,
                title: "Easy Event Discovery",
                description:
                  "Allow attendees to explore published expos and discover exhibitor information.",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={index}
                  className="bg-slate-50/80 hover:bg-white rounded-3xl p-8 border border-slate-200/70 hover:shadow-xl transition-all duration-300 group space-y-4"
                >

                  <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>

                </div>
              );
            })}

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">

          <div className="inline-flex items-center gap-2 text-xs font-semibold bg-indigo-50 text-indigo-700 px-3.5 py-1.5 rounded-full border border-indigo-100">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span>Workflow & Experience</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How EventSphere Works
          </h2>

          <p className="text-slate-600 text-base">
            Dedicated experiences for administrators, exhibitors,
            and attendees.
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* ADMIN */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-5 relative">

            <div className="absolute -top-4 left-8 bg-indigo-600 text-white font-extrabold text-sm h-8 w-8 rounded-xl flex items-center justify-center shadow-md">
              01
            </div>

            <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mt-2">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              For Admin / Organizers
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              Create and manage expos, review exhibitor applications,
              assign booths, and organize event sessions.
            </p>

          </div>

          {/* EXHIBITOR */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-5 relative">

            <div className="absolute -top-4 left-8 bg-violet-600 text-white font-extrabold text-sm h-8 w-8 rounded-xl flex items-center justify-center shadow-md">
              02
            </div>

            <div className="h-12 w-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mt-2">
              <Building2 className="h-6 w-6" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              For Exhibitors
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              Build company profiles, showcase products and services,
              explore expos, and apply to participate.
            </p>

          </div>

          {/* ATTENDEE */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-5 relative">

            <div className="absolute -top-4 left-8 bg-indigo-600 text-white font-extrabold text-sm h-8 w-8 rounded-xl flex items-center justify-center shadow-md">
              03
            </div>

            <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mt-2">
              <Users className="h-6 w-6" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              For Attendees
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              Discover published expos, explore exhibitor profiles,
              and view available event schedules.
            </p>

          </div>

        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden border-t border-slate-800">

        <div className="absolute inset-0 bg-indigo-600/5 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Be Part of Something Bigger!
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Discover exciting expos, connect with businesses,
            and experience events in a better and more organized way.
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

export default Home;
