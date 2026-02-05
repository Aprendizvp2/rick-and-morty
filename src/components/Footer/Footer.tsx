import { Users } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto bg-white border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600">
              Data provided by the Rick and Morty API
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-400" />
            <span className="text-sm text-gray-500">
              {new Date().getFullYear()} - Character Explorer
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

