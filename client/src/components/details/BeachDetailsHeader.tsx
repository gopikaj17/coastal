import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const BeachDetailsHeader = () => {
  return (
    <div className="flex items-center mb-4">
      <Link href="/">
        <Button variant="outline" size="icon" className="mr-3 bg-neutral-100 p-2 rounded-full">
          <i className="fas fa-arrow-left text-neutral-700"></i>
        </Button>
      </Link>
      <h2 className="text-xl font-semibold">Beach Details</h2>
    </div>
  );
};

export default BeachDetailsHeader;
