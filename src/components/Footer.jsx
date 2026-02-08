import React from "react";
import { Mail, Github, Linkedin, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="mt-24 border-t"
      style={{
        borderColor: "var(--card-border)",
        background: "var(--bg-main)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* About Section */}
          <div className="col-span-1">
            <h3
              className="text-sm font-bold uppercase tracking-widest mb-4"
              style={{ color: "var(--primary-color)" }}
            >
              About ShutterSync
            </h3>
            <p
              className="text-xs leading-relaxed opacity-70"
              style={{ color: "var(--text-secondary)" }}
            >
              ShutterSync is a lightweight photography management platform
              designed to streamline photographer operations, assignments, and
              bookings with an elegant interface.
            </p>
          </div>

          {/* Product Section */}
          <div className="col-span-1">
            <h3
              className="text-sm font-bold uppercase tracking-widest mb-4"
              style={{ color: "var(--primary-color)" }}
            >
              Product
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="#dashboard"
                  className="opacity-60 hover:opacity-100 transition-opacity"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="opacity-60 hover:opacity-100 transition-opacity"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="opacity-60 hover:opacity-100 transition-opacity"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Features
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div className="col-span-1">
            <h3
              className="text-sm font-bold uppercase tracking-widest mb-4"
              style={{ color: "var(--primary-color)" }}
            >
              Resources
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="#docs"
                  className="opacity-60 hover:opacity-100 transition-opacity"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#blog"
                  className="opacity-60 hover:opacity-100 transition-opacity"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#support"
                  className="opacity-60 hover:opacity-100 transition-opacity"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="col-span-1">
            <h3
              className="text-sm font-bold uppercase tracking-widest mb-4"
              style={{ color: "var(--primary-color)" }}
            >
              Get in Touch
            </h3>
            <div className="space-y-3">
              <a
                href="mailto:contact@shuttersync.com"
                className="flex items-center gap-2 text-xs opacity-60 hover:opacity-100 transition-opacity"
                style={{ color: "var(--text-secondary)" }}
              >
                <Mail size={14} />
                contact@shuttersync.com
              </a>
              <a
                href="https://github.com/d3vjamal"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs opacity-60 hover:opacity-100 transition-opacity"
                style={{ color: "var(--text-secondary)" }}
              >
                <Github size={14} />
                GitHub
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs opacity-60 hover:opacity-100 transition-opacity"
                style={{ color: "var(--text-secondary)" }}
              >
                <Linkedin size={14} />
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px my-8"
          style={{ background: "var(--card-border)" }}
        />

        {/* Developer Credit & Legal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Developer Credit */}
          <div className="text-center md:text-left">
            <p
              className="text-xs flex items-center justify-center md:justify-start gap-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Made with
              <Heart size={12} className="text-red-500 fill-red-500" />
              by{" "}
              <span
                style={{ color: "var(--primary-color)", fontWeight: "bold" }}
              >
                d3vjamal
              </span>
            </p>
            <p
              className="text-[10px] opacity-50 mt-1"
              style={{ color: "var(--text-secondary)" }}
            >
              © {new Date().getFullYear()} ShutterSync. All rights reserved.
            </p>
          </div>

          {/* Legal Links */}
          <div className="flex items-center justify-center md:justify-end gap-6">
            <a
              href="#privacy"
              className="text-xs opacity-60 hover:opacity-100 transition-opacity"
              style={{ color: "var(--text-secondary)" }}
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="text-xs opacity-60 hover:opacity-100 transition-opacity"
              style={{ color: "var(--text-secondary)" }}
            >
              Terms of Service
            </a>
            <a
              href="#contact"
              className="text-xs opacity-60 hover:opacity-100 transition-opacity"
              style={{ color: "var(--text-secondary)" }}
            >
              Contact
            </a>
          </div>
        </div>

        {/* Version Info */}
        <div className="mt-6 text-center">
          <p
            className="text-[9px] uppercase tracking-widest opacity-40"
            style={{ color: "var(--text-secondary)" }}
          >
            ShutterSync v0.1.0 — Built with React &amp; Convex
          </p>
        </div>
      </div>
    </footer>
  );
}
