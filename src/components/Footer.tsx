import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Brain, Shield, FileText, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-foreground via-foreground/95 to-foreground/90 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-glow to-secondary bg-clip-text text-transparent">
              BodyType Blueprint
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              AI-powered body type classification for smarter fitness training. Get personalized workout plans based on your unique physique.
            </p>
            <Badge variant="outline" className="border-primary/50 text-primary-glow">
              <Brain className="h-3 w-3 mr-1" />
              Powered by AI
            </Badge>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#upload-section" className="text-white/70 hover:text-primary-glow transition-colors">
                  Upload Photo
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-primary-glow transition-colors">
                  Body Types Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-primary-glow transition-colors">
                  Workout Plans
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-primary-glow transition-colors">
                  Nutrition Tips
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-white/70 hover:text-primary-glow transition-colors flex items-center gap-2">
                  <Shield className="h-3 w-3" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-primary-glow transition-colors flex items-center gap-2">
                  <FileText className="h-3 w-3" />
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-primary-glow transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:hello@bodytypeblueprint.com" className="text-white/70 hover:text-primary-glow transition-colors flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-primary-glow transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-primary-glow transition-colors">
                  Help Center
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-white/20" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
          <p>
            © 2024 BodyType Blueprint. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span>Made with AI-powered classification</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              <span className="text-xs">Model v2.1</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;