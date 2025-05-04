import { Link } from "wouter";
import { useMobile } from "@/hooks/use-mobile";

interface MobileNavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const MobileNavbar = ({ currentPath, onNavigate }: MobileNavbarProps) => {
  const isMobile = useMobile();
  
  // If not on mobile, don't render the navbar
  if (!isMobile) return null;
  
  const isActive = (path: string) => currentPath === path;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-neutral-200">
      <div className="flex justify-around">
        <Link href="/">
          <a className={`flex flex-col items-center p-2 flex-1 ${isActive('/') ? 'text-primary' : 'text-neutral-500'}`}>
            <i className="fas fa-home text-lg"></i>
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        
        <Link href="/map">
          <a className={`flex flex-col items-center p-2 flex-1 ${isActive('/map') ? 'text-primary' : 'text-neutral-500'}`}>
            <i className="fas fa-map-marked-alt text-lg"></i>
            <span className="text-xs mt-1">Map</span>
          </a>
        </Link>
        
        <Link href="/alerts">
          <a className={`flex flex-col items-center p-2 flex-1 ${isActive('/alerts') ? 'text-primary' : 'text-neutral-500'}`}>
            <i className="fas fa-bell text-lg"></i>
            <span className="text-xs mt-1">Alerts</span>
          </a>
        </Link>
        
        <Link href="/settings">
          <a className={`flex flex-col items-center p-2 flex-1 ${isActive('/settings') ? 'text-primary' : 'text-neutral-500'}`}>
            <i className="fas fa-cog text-lg"></i>
            <span className="text-xs mt-1">Settings</span>
          </a>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNavbar;
