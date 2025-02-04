import { Link } from "@remix-run/react";
import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  to: string;
}

const BackButton = ({ to }: BackButtonProps) => {
  return (
    <Link
      className="fixed top-1 left-4 m-4 p-2 hover:bg-gray-50 rounded"
      to={to}
    >
      <ChevronLeft className="h-8 w-8" />
    </Link>
  );
};

export default BackButton;
