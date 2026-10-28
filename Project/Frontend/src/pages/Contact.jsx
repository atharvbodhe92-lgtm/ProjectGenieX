import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

export default function Contact() {
  const form = useRef();
  const [status, setStatus] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();
    
    // फॉर्ममधील माहिती घेणे
    const name = form.current.user_name.value;
    const email = form.current.user_email.value;
    const message = form.current.message.value;

    // थेट ईमेल उघडण्यासाठी लिंक तयार करणे
    const mailtoLink = `mailto:workfrombusiness77@gmail.com?subject=Contact Form Message from ${name}&body=${encodeURIComponent(message)}%0A%0A---%0AFrom: ${name}%0AEmail: ${email}`;

    // ब्राउझरमध्ये ईमेल ॲप उघडणे
    window.location.href = mailtoLink;

    setStatus("✅ Redirecting to your email client...");
    form.current.reset();
    
    // ३ सेकंदानंतर स्टेटस मेसेज घालवणे
    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <section
      id="contact"
      className="bg-gradient-to-br from-[#1d3c42] via-[#143438] to-[#0c2328] text-white py-20 px-6 md:px-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16"
      >
        {/* Contact Info */}
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-cyan-300">Get in Touch</h2>
          <p className="text-gray-300">
            Have a question, feedback, or just want to say hi? Feel free to reach out. We'd love to hear from you!
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Mail className="text-cyan-300 w-6 h-6" />
              <span className="text-white">workfrombusiness77@gmail.com</span>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="text-cyan-300 w-6 h-6" />
              <span className="text-white">+91 7972314674</span>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="text-cyan-300 w-6 h-6" />
              <span className="text-white">Vita, Maharashtra, India</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form
          ref={form}
          onSubmit={sendEmail}
          className="bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-md border border-white/10 space-y-6"
        >
          <div>
            <label className="block mb-1 text-sm text-cyan-200">Your Name</label>
            <input
              type="text"
              name="user_name"
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-cyan-200">Email</label>
            <input
              type="email"
              name="user_email"
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-cyan-200">Message</label>
            <textarea
              name="message"
              className="w-full px-4 py-2 h-32 rounded-lg bg-white/10 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Your message..."
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-xl transition-all duration-300 shadow-md hover:shadow-cyan-500/40"
          >
            Send Message
          </button>

          {status && (
            <p className="text-center text-sm mt-4 text-cyan-300">{status}</p>
          )}
        </form>
      </motion.div>
    </section>
  );
}
