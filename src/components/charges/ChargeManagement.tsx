import { CreditCard } from "lucide-react";
import { useGetCharges } from "../../services/charges";
import Card from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const Charges = () => {
  const { data: charges, isLoading } = useGetCharges();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Charge Management
          </h2>
          <p className="text-gray-600 mt-1">
            Create and manage service charges for residents
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-16 w-full bg-slate-600" />
            <Skeleton className="h-16 w-full bg-slate-600" />
            <Skeleton className="h-16 w-full bg-slate-600" />
          </>
        ) : (
          <Card
            label="Total Charges"
            value={charges?.length || 0}
            icon={CreditCard}
          />
        )}
      </div>
    </div>
  );
};

export default Charges;
