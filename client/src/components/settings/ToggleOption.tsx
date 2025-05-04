import { Switch } from "@/components/ui/switch";

interface ToggleOptionProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleOption = ({ title, description, checked, onChange }: ToggleOptionProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-neutral-500">{description}</p>
      </div>
      <Switch 
        checked={checked} 
        onCheckedChange={onChange}
      />
    </div>
  );
};

export default ToggleOption;
