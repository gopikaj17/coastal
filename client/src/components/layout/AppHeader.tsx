import { Link } from "wouter";
import { useMobile } from "@/hooks/use-mobile";

interface AppHeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const AppHeader = ({ currentPath, onNavigate }: AppHeaderProps) => {
  const isMobile = useMobile();
  
  const isActive = (path: string) => currentPath === path;
  
  return (
    <header className="bg-primary text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <i className="fas fa-water text-2xl mr-2"></i>
          <h1 className="text-xl font-semibold">WaveGuard</h1>
        </div>
        
        {/* Only show top navigation on desktop */}
        {!isMobile && (
          <nav className="flex">
            <Link href="/">
              <a className={`px-3 py-1 mx-1 rounded-md ${isActive('/') ? 'bg-primary-700' : 'hover:bg-primary-700'} flex items-center`}>
                <i className="fas fa-home mr-1"></i>
                <span className="hidden sm:inline">Home</span>
              </a>
            </Link>
            
            <Link href="/map">
              <a className={`px-3 py-1 mx-1 rounded-md ${isActive('/map') ? 'bg-primary-700' : 'hover:bg-primary-700'} flex items-center`}>
                <i className="fas fa-map-marked-alt mr-1"></i>
                <span className="hidden sm:inline">Map</span>
              </a>
            </Link>
            
            <Link href="/alerts">
              <a className={`px-3 py-1 mx-1 rounded-md ${isActive('/alerts') ? 'bg-primary-700' : 'hover:bg-primary-700'} flex items-center`}>
                <i className="fas fa-bell mr-1"></i>
                <span className="hidden sm:inline">Alerts</span>
              </a>
            </Link>
            
            <Link href="/settings">
              <a className={`px-3 py-1 mx-1 rounded-md ${isActive('/settings') ? 'bg-primary-700' : 'hover:bg-primary-700'} flex items-center`}>
                <i className="fas fa-cog mr-1"></i>
                <span className="hidden sm:inline">Settings</span>
              </a>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
