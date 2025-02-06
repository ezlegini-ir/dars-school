import { Copyright } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex justify-between mt-12">
      <p className="text-xs flex gap-2 items-center">
        <Copyright size={16} /> {currentYear} - Dars School | By
        <a target="_blank" href="https://igraphical.ir">
          iGraphical.ir
        </a>
      </p>
      <div className="space-x-4">
        <Link className="text-xs" href="/about">
          About Us
        </Link>
        <Link className="text-xs" href="/faq">
          FAQ
        </Link>
        <Link className="text-xs" href="/terms">
          Terms and Conditions
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
