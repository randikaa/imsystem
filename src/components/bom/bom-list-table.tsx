'use client';

import { BOM } from '@/types/bom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';

interface BOMListTableProps {
  boms: BOM[];
  onEdit: (bom: BOM) => void;
  onDelete: (id: string) => void;
}

export function BOMListTable({ boms, onEdit, onDelete }: BOMListTableProps) {
  const checkAvailability = (bom: BOM) => {
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
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{bom.name}</h3>
                    <Badge variant="outline">{bom.code}</Badge>
                    <Badge variant={bom.status === 'active' ? 'default' : 'secondary'}>{bom.status}</Badge>
                    {isAvailable ? (
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Stock Available
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Insufficient Stock
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{bom.description}</p>
                  <p className="text-sm text-gray-500">Final Product: {bom.finalProductName} ({bom.finalProductSku})</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Cost</p>
                    <p className="text-xl font-bold">Rs. {bom.totalCost.toLocaleString('en-LK')}</p>
                    <p className="text-xs text-gray-500">{bom.estimatedTime} min</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(bom)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(bom.id)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                    <TableHead>Unit Cost</TableHead>
                    <TableHead>Total Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bom.components.map((comp) => {
                    const hasStock = comp.availableStock >= comp.quantityRequired;
                    
                    return (
                      <TableRow key={comp.id}>
                        <TableCell className="font-medium">{comp.productName}</TableCell>
                        <TableCell>{comp.productSku}</TableCell>
                        <TableCell>{comp.quantityRequired}</TableCell>
                        <TableCell className={hasStock ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                          {comp.availableStock}
                        </TableCell>
                        <TableCell>
                          {hasStock ? (
                            <Badge className="bg-green-100 text-green-700">Available</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-700">
                              Short {comp.quantityRequired - comp.availableStock}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>Rs. {comp.unitCost.toLocaleString('en-LK')}</TableCell>
                        <TableCell>Rs. {comp.totalCost.toLocaleString('en-LK')}</TableCell>
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
