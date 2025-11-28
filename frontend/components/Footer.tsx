import Link from "next/link";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import XIcon from "@mui/icons-material/X";

export default function Footer() {
  return (
    <footer className="py-10 bg-sidebar/50 border-t border-sidebar-border mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start">
          <h5 className="text-lg font-bold text-foreground">AIdentify</h5>
          <p className="text-foreground/60">
            © 2025 AIdentify. All rights reserved.
          </p>
        </div>

        {/* Social Media Links */}
        <div className="flex gap-5">
          <Link
            href="https://www.linkedin.com/in/kamlesh5242/"
            className="text-foreground/60 hover:text-primary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon className="w-6 h-6" />
          </Link>
          <Link
            href="https://github.com/kamlesh0928"
            className="text-foreground/60 hover:text-primary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon className="w-6 h-6" />
          </Link>
          <Link
            href="https://x.com/kamlesh09285242"
            className="text-foreground/60 hover:text-primary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <XIcon className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
