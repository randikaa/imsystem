'use client';

import { BOMItem } from '@/types/inventory-new';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface BOMTableProps {
  boms: BOMItem[];
}

export function BOMTable({ boms }: BOMTableProps) {
  const checkAvailability = (bom: BOMItem) => {
    return bom.components.every(comp => comp.availableStock >= comp.quantityRequired);
  };

  return (
    <div className="space-y-4">
      {boms.length === 0 ? (
        <div className="rounded-md border bg-white p-8 text-center text-muted-foreground">
          No BOMs found
        </div>
      ) : (
        boms.map((bom) => {
          const isAvailable = checkAvailability(bom);
          
          return (
            <div key={bom.id} className="rounded-lg border bg-white p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{bom.name}</h3>
                    <Badge variant="outline">{bom.code}</Badge>
                    {isAvailable ? (
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Available
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Insufficient Stock
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{bom.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Cost</p>
                  <p className="text-xl font-bold">Rs. {bom.totalCost.toLocaleString('en-LK')}</p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Required</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bom.components.map((comp, idx) => {
                    const hasStock = comp.availableStock >= comp.quantityRequired;
                    
                    return (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{comp.productName}</TableCell>
                        <TableCell>{comp.productSku}</TableCell>
                        <TableCell>{comp.quantityRequired}</TableCell>
                        <TableCell className={hasStock ? 'text-green-600' : 'text-red-600'}>
                          {comp.availableStock}
                        </TableCell>
                        <TableCell>
                          {hasStock ? (
                            <Badge className="bg-green-100 text-green-700">OK</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-700">
                              Short {comp.quantityRequired - comp.availableStock}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>Rs. {(comp.cost * comp.quantityRequired).toLocaleString('en-LK')}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          );
        })
      )}
    </div>
  );
}
