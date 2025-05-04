import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import BeachDetails from "@/pages/beach-details";
import Map from "@/pages/map";
import Alerts from "@/pages/alerts";
import Settings from "@/pages/settings";
import AppHeader from "@/components/layout/AppHeader";
import MobileNavbar from "@/components/layout/MobileNavbar";
import { AppProvider } from "@/contexts/AppContext";

function Router() {
  const [location, setLocation] = useLocation();

  return (
    <>
      <AppHeader currentPath={location} onNavigate={setLocation} />
      
      <main className="container mx-auto p-4 pb-16">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/beach/:id" component={BeachDetails} />
          <Route path="/map" component={Map} />
          <Route path="/alerts" component={Alerts} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </main>
      
      <MobileNavbar currentPath={location} onNavigate={setLocation} />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <div className="font-sans bg-neutral-100 text-neutral-900 min-h-screen">
          <Router />
          <Toaster />
        </div>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
