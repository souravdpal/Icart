import { Copyright } from "lucide-react";

export default function Footer() {
  return (
    <footer className="p-4 flex justify-center items-center">
      <p className="flex items-center gap-1 p-3">
        <Copyright className="h-4 w-4" />
        All rights reserved.
      </p>
    </footer>
  );
}