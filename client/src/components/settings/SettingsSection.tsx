import { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
}

const SettingsSection = ({ title, children }: SettingsSectionProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="font-semibold text-lg mb-3">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default SettingsSection;
