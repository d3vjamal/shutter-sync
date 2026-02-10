import React from "react";
import { Mail, Github, Linkedin, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 border-t bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* About Section */}
          <div className="col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-primary">
              About ShutterSync
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              ShutterSync is a lightweight photography management platform
              designed to streamline photographer operations, assignments, and
              bookings with an elegant interface.
            </p>
          </div>

          {/* Product Section */}
          <div className="col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-primary">
              Product
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="#dashboard"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-primary">
              Get in Touch
            </h3>
            <div className="space-y-3">
              <a
                href="mailto:d3v.jamal@gmail.com"
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail size={14} />
                d3v.jamal@gmail.com
              </a>
              <a
                href="https://github.com/d3vjamal"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github size={14} />
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/d3vjamal"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin size={14} />
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px my-8 bg-border" />

        {/* Developer Credit & Legal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Developer Credit */}
          <div className="text-center md:text-left">
            <p className="text-xs flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
              Made with
              <Heart size={12} className="text-secondary fill-secondary" />
              by <span className="text-primary font-bold">d3vjamal</span>
            </p>
            <p className="text-[10px] text-muted-foreground/60 mt-1">
              © {new Date().getFullYear()} ShutterSync. All rights reserved.
            </p>
          </div>

          {/* Legal Links */}
          <div className="flex items-center justify-center md:justify-end gap-6">
            <a
              href="#privacy"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#contact"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
