import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { AppContext } from "@/contexts/AppContext";
import { updateUserSettings } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { 
  RefreshRate, 
  Units, 
  Language,
  ThemeMode
} from "@/types";

import SettingsSection from "@/components/settings/SettingsSection";
import ToggleOption from "@/components/settings/ToggleOption";
import SelectOption from "@/components/settings/SelectOption";

const Settings = () => {
  const { state, updateSettings } = useContext(AppContext);
  const { toast } = useToast();
  
  // Mutation for updating settings
  const { mutate, isPending } = useMutation({
    mutationFn: updateUserSettings,
    onSuccess: (updatedSettings) => {
      updateSettings(updatedSettings);
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({
        title: "Settings updated",
        description: "Your preferences have been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating settings",
        description: "An error occurred while saving your preferences. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    }
  });
  
  // Handle toggle changes
  const handleToggleChange = (settingKey: string, value: boolean) => {
    if (!state.settings) return;
    
    mutate({ [settingKey]: value });
  };
  
  // Handle select changes
  const handleSelectChange = (settingKey: string, value: string) => {
    if (!state.settings) return;
    
    mutate({ [settingKey]: value });
  };
  
  if (!state.settings) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Settings</h2>
        <p className="text-neutral-500 text-sm">Customize your WaveGuard experience</p>
      </div>
      
      {/* General Settings */}
      <SettingsSection title="General">
        <ToggleOption
          title="Dark Mode"
          description="Change app appearance"
          checked={state.settings.darkMode}
          onChange={(checked) => handleToggleChange('darkMode', checked)}
        />
        
        <SelectOption
          title="Units"
          description="Measurement system"
          value={state.settings.units}
          onChange={(value) => handleSelectChange('units', value as Units)}
          options={[
            { value: "metric", label: "Metric (°C, km/h)" },
            { value: "imperial", label: "Imperial (°F, mph)" }
          ]}
        />
        
        <SelectOption
          title="Language"
          description="App language"
          value={state.settings.language}
          onChange={(value) => handleSelectChange('language', value as Language)}
          options={[
            { value: "english", label: "English" },
            { value: "hindi", label: "Hindi" },
            { value: "tamil", label: "Tamil" },
            { value: "telugu", label: "Telugu" }
          ]}
        />
      </SettingsSection>
      
      {/* Notification Settings */}
      <SettingsSection title="Notifications">
        <ToggleOption
          title="Push Notifications"
          description="Enable or disable all alerts"
          checked={state.settings.enablePushNotifications}
          onChange={(checked) => handleToggleChange('enablePushNotifications', checked)}
        />
        
        <ToggleOption
          title="Safety Alerts"
          description="High tides, rip currents, storms"
          checked={state.settings.enableSafetyAlerts}
          onChange={(checked) => handleToggleChange('enableSafetyAlerts', checked)}
        />
        
        <ToggleOption
          title="Weather Updates"
          description="Temperature, UV, rain"
          checked={state.settings.enableWeatherUpdates}
          onChange={(checked) => handleToggleChange('enableWeatherUpdates', checked)}
        />
        
        <ToggleOption
          title="Water Quality Alerts"
          description="Pollution, bacteria levels"
          checked={state.settings.enableWaterQualityAlerts}
          onChange={(checked) => handleToggleChange('enableWaterQualityAlerts', checked)}
        />
      </SettingsSection>
      
      {/* Data & Privacy Settings */}
      <SettingsSection title="Data & Privacy">
        <ToggleOption
          title="Location Services"
          description="Allow location access"
          checked={state.settings.locationServices}
          onChange={(checked) => handleToggleChange('locationServices', checked)}
        />
        
        <SelectOption
          title="Data Refresh Rate"
          description="How often data updates"
          value={state.settings.dataRefreshRate}
          onChange={(value) => handleSelectChange('dataRefreshRate', value as RefreshRate)}
          options={[
            { value: "15min", label: "Every 15 minutes" },
            { value: "30min", label: "Every 30 minutes" },
            { value: "60min", label: "Every hour" },
            { value: "manual", label: "Manual only" }
          ]}
        />
        
        <ToggleOption
          title="Save Beach History"
          description="Remember visited beaches"
          checked={state.settings.saveBeachHistory}
          onChange={(checked) => handleToggleChange('saveBeachHistory', checked)}
        />
        
        <div className="mt-2">
          <button className="text-primary text-sm">View Privacy Policy</button>
        </div>
      </SettingsSection>
      
      {/* About Section */}
      <SettingsSection title="About">
        <div className="space-y-2">
          <p className="text-sm">Version 1.0.2</p>
          <div className="flex gap-2">
            <button className="text-primary text-sm">Terms of Service</button>
            <span className="text-neutral-300">|</span>
            <button className="text-primary text-sm">Open Source Licenses</button>
          </div>
          <p className="text-xs text-neutral-500 mt-2">© 2023 WaveGuard. All rights reserved.</p>
        </div>
      </SettingsSection>
    </div>
  );
};

export default Settings;
