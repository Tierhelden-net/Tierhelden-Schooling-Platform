import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import Link from "next/link";

interface DataCardProps {
  value?: number;
  label: string;
  shouldFormat?: boolean;
  url?: string;
  children?: React.ReactNode;
}

export const DataCard = ({
  value,
  label,
  shouldFormat,
  url,
  children,
}: DataCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {shouldFormat && value ? formatPrice(value) : value}
        </div>
        {url && (
          <Link href={url} className="text-xs text-blue-500">
            {label} anzeigen
          </Link>
        )}
        {children && children}
      </CardContent>
    </Card>
  );
};
