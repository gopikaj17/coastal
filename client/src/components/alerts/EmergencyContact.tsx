import { useQuery } from "@tanstack/react-query";
import { fetchEmergencyContacts } from "@/lib/api";

const EmergencyContact = () => {
  const { data: contacts, isLoading } = useQuery({
    queryKey: ['/api/emergency-contacts'],
  });
  
  if (isLoading) {
    return (
      <div className="mt-6">
        <div className="bg-red-50 border-l-4 border-unsafe p-4 rounded-lg flex items-center">
          <i className="fas fa-phone-alt text-2xl text-unsafe mr-3"></i>
          <div>
            <h3 className="font-semibold">Emergency Contact</h3>
            <p className="text-sm">Loading emergency contacts...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!contacts || contacts.length === 0) {
    return (
      <div className="mt-6">
        <div className="bg-red-50 border-l-4 border-unsafe p-4 rounded-lg flex items-center">
          <i className="fas fa-phone-alt text-2xl text-unsafe mr-3"></i>
          <div>
            <h3 className="font-semibold">Emergency Contact</h3>
            <p className="text-sm">Coast Guard: <a href="tel:1800-180-3123" className="text-primary">1800-180-3123</a></p>
            <p className="text-sm">Beach Patrol: <a href="tel:104" className="text-primary">104</a></p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-6">
      <div className="bg-red-50 border-l-4 border-unsafe p-4 rounded-lg flex items-center">
        <i className="fas fa-phone-alt text-2xl text-unsafe mr-3"></i>
        <div>
          <h3 className="font-semibold">Emergency Contact</h3>
          {contacts.map(contact => (
            <p key={contact.id} className="text-sm">
              {contact.name}: <a href={`tel:${contact.number}`} className="text-primary">{contact.number}</a>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmergencyContact;
