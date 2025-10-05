import { Globe2, Github, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-border/40 bg-card mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe2 className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Earth in Your Hands</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Predicting Cleaner, Safer Skies with NASA TEMPO satellite data and ground networks.
            </p>
          </div>

          {/* Links Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Challenge</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://www.spaceappschallenge.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  NASA Space Apps Challenge
                </a>
              </li>
              <li>
                <a
                  href="https://tempo.si.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  TEMPO Mission
                </a>
              </li>
              <li>
                <a
                  href="https://www.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  NASA
                </a>
              </li>
            </ul>
          </div>

          {/* Social Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Connect</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </a>
              <a
                href="#"
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>
            © 2025 Earth in Your Hands. Created for NASA Space Apps Challenge.
          </p>
          <p className="mt-1">
            Built with data from NASA TEMPO, Pandora Network, and OpenAQ.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
