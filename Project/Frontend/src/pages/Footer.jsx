import { FaInstagram, FaTwitter, FaFacebook, FaYoutube } from 'react-icons/fa'

const Footer = () => {
  const year = new Date().getFullYear()
  return (
    <footer className="w-full bg-[#0d414e] text-white px-6 md:px-10 py-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Brand / Blurb */}
        <div className="max-w-md">
          <h3 className="text-lg font-semibold">ProjectGenie</h3>
          <p className="text-sm text-white/80 mt-1">Your assistant to discover titles and generate end‑to‑end project plans.</p>
          <p className="text-xs text-white/60 mt-2">Built with ❤️ for students and builders.</p>
        </div>

        {/* Socials */}
        <div className="flex items-center gap-4">
          <a href="#" aria-label="Instagram" className="text-xl hover:text-pink-400 transition-colors">
            <FaInstagram />
          </a>
          <a href="#" aria-label="Twitter" className="text-xl hover:text-blue-400 transition-colors">
            <FaTwitter />
          </a>
          <a href="#" aria-label="YouTube" className="text-xl hover:text-red-500 transition-colors">
            <FaYoutube />
          </a>
          <a href="#" aria-label="Facebook" className="text-xl hover:text-blue-600 transition-colors">
            <FaFacebook />
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex flex-col">
          <p className="text-xs text-white/70">© {year} ProjectGenie. All rights reserved.</p>
          {/* इथे आपण तुझं ब्रँड नाव टाकलं आहे */}
          <p className="text-sm text-white/90 mt-1">
            Developed by <span className="text-cyan-400 font-bold tracking-wide">Student Web Solutions</span>
          </p>
        </div>
        {/* इथे आपण तुझा खरा ईमेल टाकला आहे */}
        <p className="text-xs text-white/60">Need help? <a href="mailto:workfrombusiness77@gmail.com" className="underline hover:text-cyan-300">workfrombusiness77@gmail.com</a></p>
      </div>
    </footer>
  )
}

export default Footer
