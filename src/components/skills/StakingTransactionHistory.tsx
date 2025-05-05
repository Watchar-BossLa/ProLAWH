
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSkillStaking } from '@/hooks/useSkillStaking';

interface StakingTransactionHistoryProps {
  isLoading?: boolean;
}

/**
 * StakingTransactionHistory - Displays a paginated history of staking transactions
 * 
 * This component shows a chronological list of all staking actions (create, withdraw, earn)
 * with relevant details and transaction status.
 */
export function StakingTransactionHistory({ isLoading = false }: StakingTransactionHistoryProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { transactions } = useSkillStaking();
  
  // Pagination settings
  const itemsPerPage = 10;
  const totalPages = transactions ? Math.ceil(transactions.length / itemsPerPage) : 1;
  
  // Calculate pagination range
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, transactions?.length || 0);
  const currentTransactions = transactions?.slice(startIndex, endIndex) || [];
  
  // Format timestamp to readable date
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };
  
  // Get the appropriate badge color for transaction status
  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Skill</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Transaction ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                </TableRow>
              ))
            ) : transactions && transactions.length > 0 ? (
              currentTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{formatDate(tx.timestamp)}</TableCell>
                  <TableCell>
                    <Badge variant={tx.type === 'earn' ? 'secondary' : tx.type === 'stake' ? 'default' : 'outline'}>
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{tx.skillName}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(tx.amount)}
                  </TableCell>
                  <TableCell>{getStatusBadge(tx.status)}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {tx.transactionId.slice(0, 8)}...{tx.transactionId.slice(-8)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No transaction history available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {transactions && transactions.length > 0 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  aria-disabled={currentPage <= 1}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {/* Generate page links */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageToShow;
                
                if (totalPages <= 5) {
                  pageToShow = i + 1;
                } else if (currentPage <= 3) {
                  pageToShow = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageToShow = totalPages - 4 + i;
                } else {
                  pageToShow = currentPage - 2 + i;
                }
                
                return (
                  <PaginationItem key={pageToShow}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageToShow)}
                      isActive={pageToShow === currentPage}
                    >
                      {pageToShow}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  aria-disabled={currentPage >= totalPages}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>
  );
}
