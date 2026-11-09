import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { 
  Layers, 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Loader2, 
  Sparkles, 
  MessageSquare 
} from "lucide-react";

const Contact = () => {
  const { user } = useSelector((state) => state.auth);
  
  // state
  const [contact, setContact] = useState({
    username: "",
    email: "",
    message: "" 
  });

  const [loading, setLoading] = useState(false);

  // useeffect
  useEffect(() => {
    if (user) {
      setContact((prev) => ({
        ...prev,
        username: user.username || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  // handleInput
  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setContact({
      ...contact,
      [name]: value
    });
  };

  // handleSubmit     
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post("/form/contact", contact);
      console.log(response);
      
      if (response.status === 201) {
        // Reset message while retaining user's prefilled info if logged in
        setContact({
          username: user?.username || "",
          email: user?.email || "",
          message: ""
        });
        toast.success(response.data.message || "Message sent successfully!");
      } 
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
    
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Page Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl border border-indigo-100">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span>EventSphere Support & Inquiries</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Get in Touch with Our Team
          </h1>
          <p className="text-base text-slate-600">
            Have questions about upcoming expos, exhibitions, or need assistance managing your event? We are here to help.
          </p>
        </div>

        {/* Two-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Section: Contact Information */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden flex flex-col justify-between space-y-8">
            {/* Background Decorative Glow */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                  <Layers className="h-5 w-5" />
                </div>
                <span className="font-bold text-xl tracking-tight text-white">
                  EventSphere
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
                  Let's Connect
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Have a question about an expo or need assistance with your event? Our team is here to help you succeed.
                </p>
              </div>

              {/* Contact Details List */}
              <div className="space-y-6 pt-4 border-t border-slate-800">
                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 flex-shrink-0 mt-0.5">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email Us</p>
                    <p className="text-sm font-semibold text-white mt-0.5">support@eventsphere.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 flex-shrink-0 mt-0.5">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Call Us</p>
                    <p className="text-sm font-semibold text-white mt-0.5">+1 (555) 234-5678</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 flex-shrink-0 mt-0.5">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Office Location</p>
                    <p className="text-sm font-semibold text-white mt-0.5">100 Convention Center Dr, Suite 400, NY</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 border-t border-slate-800 text-xs text-slate-500">
              Response time: Within 24 business hours.
            </div>
          </div>

          {/* Right Section: Contact Form Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10">
            <div className="mb-8">
              <div className="flex items-center space-x-2 text-indigo-600 mb-1">
                <MessageSquare className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Send Us a Message</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                We'd love to hear from you
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Fill out the form below and we'll get back to you shortly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div>
                <label 
                  htmlFor="username" 
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
                >
                  Full Name
                </label>
                <input 
                  type="text" 
                  id="username" 
                  name="username" 
                  value={contact.username}
                  onChange={handleInput}
                  required 
                  autoComplete="off"  
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
                >
                  Email Address
                </label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={contact.email}
                  onChange={handleInput}
                  required 
                  autoComplete="email"  
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              {/* Message */}
              <div>
                <label 
                  htmlFor="message" 
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
                >
                  Your Message
                </label>
                <textarea 
                  name="message" 
                  id="message" 
                  value={contact.message}
                  onChange={handleInput}
                  rows={5} 
                  required
                  autoComplete="off"
                  placeholder="Tell us how we can help..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-y"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;