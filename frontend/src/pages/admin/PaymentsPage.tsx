
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PaymentRecord } from "@/types/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PaymentsPage() {
  const { data: payments, isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_records')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as PaymentRecord[];
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Payment Management</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments?.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>${payment.amount}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                  payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {payment.status}
                </span>
              </TableCell>
              <TableCell>{payment.payment_method}</TableCell>
              <TableCell>{new Date(payment.payment_date).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
