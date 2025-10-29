'use client';

import { LedgerEntry } from '@/types/customer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface LedgerTableProps {
  ledger: LedgerEntry[];
}

export function LedgerTable({ ledger }: LedgerTableProps) {
  const getTypeBadge = (type: LedgerEntry['type']) => {
    const colors = {
      'sale': 'bg-blue-100 text-blue-700',
      'payment': 'bg-green-100 text-green-700',
      'credit': 'bg-purple-100 text-purple-700',
      'debit': 'bg-red-100 text-red-700',
    };
    return <Badge className={colors[type]}>{type}</Badge>;
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Debit</TableHead>
            <TableHead>Credit</TableHead>
            <TableHead>Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ledger.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">
                No ledger entries found
              </TableCell>
            </TableRow>
          ) : (
            ledger.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                <TableCell className="font-medium">{entry.customerName}</TableCell>
                <TableCell>{getTypeBadge(entry.type)}</TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell>{entry.reference}</TableCell>
                <TableCell className={entry.debit > 0 ? 'text-red-600 font-medium' : ''}>
                  {entry.debit > 0 ? `Rs. ${entry.debit.toLocaleString('en-LK', { minimumFractionDigits: 2 })}` : '-'}
                </TableCell>
                <TableCell className={entry.credit > 0 ? 'text-green-600 font-medium' : ''}>
                  {entry.credit > 0 ? `Rs. ${entry.credit.toLocaleString('en-LK', { minimumFractionDigits: 2 })}` : '-'}
                </TableCell>
                <TableCell className="font-bold">
                  Rs. {entry.balance.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
