import { useEffect, useState } from "react";
import {
  Building2,
  Search,
  MapPin,
  CalendarDays,
  Store,
  Globe,
  Package,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import api from "../../api/axios";

const Exhibitors = () => {
  const [exhibitors, setExhibitors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch approved exhibitors
  const fetchExhibitors = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/exhibitor/directory");
      setExhibitors(response.data.exhibitors || []);
    } catch (error) {
      console.error("Fetch exhibitors error:", error);
      setError(
        error.response?.data?.message ||
          "Unable to load exhibitors. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExhibitors();
  }, []);

  // Search exhibitors
  const filteredExhibitors = exhibitors.filter((item) => {
    const searchText = search.toLowerCase();
    return (
      item.companyName?.toLowerCase().includes(searchText) ||
      item.description?.toLowerCase().includes(searchText) ||
      item.event?.title?.toLowerCase().includes(searchText) ||
      item.productsServices?.some((product) =>
        product.toLowerCase().includes(searchText)
      )
    );
  });

  // Format date
  const formatDate = (date) => {
    if (!date) return "Date not available";
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-indigo-600" />
          <p className="mt-3 text-sm font-medium text-slate-600">
            Loading exhibitors...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <AlertCircle className="mb-3 h-12 w-12 text-red-500" />
        <p className="mb-4 text-sm font-medium text-slate-700 max-w-md">
          {error}
        </p>
        <button
          onClick={fetchExhibitors}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-500 selection:text-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 px-4 py-12 sm:py-16 md:py-20 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <span className="inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs sm:text-sm font-medium tracking-wide backdrop-blur-sm">
            EventSphere Directory
          </span>
          <h1 className="mt-4 sm:mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Meet Our Exhibitors
          </h1>
          <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-indigo-100">
            Discover innovative companies, explore their products and services,
            and connect with businesses participating in our events.
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-6 sm:mt-8 flex max-w-xl items-center rounded-xl bg-white px-4 py-2.5 shadow-xl transition focus-within:ring-2 focus-within:ring-indigo-400">
            <Search className="h-5 w-5 shrink-0 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies, products or events..."
              className="w-full border-none bg-transparent px-3 text-sm sm:text-base text-slate-800 outline-none placeholder:text-slate-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="shrink-0 text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 px-2 py-1 transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Exhibitors Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Section Heading & Counter */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Registered Exhibitors
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Explore companies participating in published events.
            </p>
          </div>
          <div className="self-start sm:self-auto rounded-lg bg-indigo-50 border border-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm">
            {filteredExhibitors.length} {filteredExhibitors.length === 1 ? "Exhibitor" : "Exhibitors"}
          </div>
        </div>

        {/* Empty State */}
        {filteredExhibitors.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <Building2 className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-800">
              No exhibitors found
            </h3>
            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
              {search
                ? "Try searching with another company or product name."
                : "There are currently no approved exhibitors to display."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredExhibitors.map((item) => (
              <div
                key={item._id}
                className="flex flex-col h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Company Header & Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-indigo-50 border border-indigo-100/60 text-indigo-600 shadow-inner">
                      {item.logoUrl ? (
                        <img
                          src={item.logoUrl}
                          alt={`${item.companyName || "Company"} logo`}
                          className="h-full w-full object-contain p-1"
                        />
                      ) : (
                        <Building2 className="h-7 w-7 sm:h-8 sm:w-8" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="break-words text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {item.companyName || "Company Name"}
                      </h3>
                      <p className="mt-0.5 text-xs sm:text-sm font-medium text-slate-500">
                        Exhibitor
                      </p>
                      {item.website && (
                        <a
                          href={
                            /^https?:\/\//i.test(item.website)
                              ? item.website
                              : `https://${item.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
                        >
                          Visit Website
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-4 sm:mt-5 flex-1">
                    <h4 className="mb-1.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-400">
                      About Company
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-600 line-clamp-3">
                      {item.description || "No company description available."}
                    </p>
                  </div>

                  {/* Products and Services */}
                  {item.productsServices?.length > 0 && (
                    <div className="mt-4 sm:mt-5">
                      <h4 className="mb-2.5 flex items-center gap-1.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-400">
                        <Package className="h-4 w-4 text-indigo-600" />
                        Products & Services
                      </h4>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {item.productsServices.map((product, index) => (
                          <span
                            key={`${product}-${index}`}
                            className="rounded-lg bg-indigo-50/80 border border-indigo-100/50 px-2.5 py-1 text-xs font-medium text-indigo-700"
                          >
                            {product}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Company Address */}
                  {item.address && (
                    <div className="mt-4 sm:mt-5 flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                      <span className="break-words">{item.address}</span>
                    </div>
                  )}
                </div>

                {/* Event Details Footer */}
                <div className="mt-auto border-t border-slate-100 bg-slate-50/70 p-5 sm:p-6">
                  <h4 className="mb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Event Information
                  </h4>
                  <div className="space-y-2.5 sm:space-y-3">
                    <div className="flex items-start gap-3">
                      <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                      <div>
                        <p className="text-[11px] font-medium text-slate-400 uppercase">
                          Event
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-slate-800 break-words">
                          {item.event?.title || "Event not available"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                      <div>
                        <p className="text-[11px] font-medium text-slate-400 uppercase">
                          Event Location
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-slate-800 break-words">
                          {item.event?.location || "Location not available"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                      <div>
                        <p className="text-[11px] font-medium text-slate-400 uppercase">
                          Event Date
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-slate-800">
                          {formatDate(item.event?.startDate)}
                          {item.event?.endDate &&
                            ` - ${formatDate(item.event.endDate)}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Store className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                      <div>
                        <p className="text-[11px] font-medium text-slate-400 uppercase">
                          Booth Number
                        </p>
                        <div className="mt-0.5 inline-block rounded-md bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-xs sm:text-sm font-semibold text-indigo-700">
                          {item.booth?.boothNumber || "Not assigned"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Exhibitors;