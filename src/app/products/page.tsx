'use client';

import { useState } from 'react';
import { Product, Brand, Category } from '@/types/product';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { ProductsTable } from '@/components/products/products-table';
import { AddProductDialog } from '@/components/products/add-product-dialog';
import { AddBrandDialog } from '@/components/products/add-brand-dialog';
import { AddCategoryDialog } from '@/components/products/add-category-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Tag, FolderTree } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const initialBrands: Brand[] = [
  { id: '1', name: 'Samsung', description: 'Electronics brand', status: 'active', createdAt: new Date().toISOString() },
  { id: '2', name: 'Apple', description: 'Premium electronics', status: 'active', createdAt: new Date().toISOString() },
  { id: '3', name: 'Sony', description: 'Audio & Video', status: 'active', createdAt: new Date().toISOString() },
];

const initialCategories: Category[] = [
  { id: '1', name: 'Electronics', description: 'Electronic devices', status: 'active', createdAt: new Date().toISOString() },
  { id: '2', name: 'Accessories', description: 'Device accessories', status: 'active', createdAt: new Date().toISOString() },
  { id: '3', name: 'Furniture', description: 'Office furniture', status: 'active', createdAt: new Date().toISOString() },
];

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Galaxy S24',
    sku: 'SAM-S24-001',
    brandId: '1',
    brandName: 'Samsung',
    categoryId: '1',
    categoryName: 'Electronics',
    description: 'Latest Samsung flagship phone',
    price: 350000,
    cost: 280000,
    quantity: 25,
    minStock: 5,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBrand, setFilterBrand] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [brandDialogOpen, setBrandDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editBrand, setEditBrand] = useState<Brand | null>(null);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBrand = filterBrand === 'all' || product.brandId === filterBrand;
    const matchesCategory = filterCategory === 'all' || product.categoryId === filterCategory;
    
    return matchesSearch && matchesBrand && matchesCategory;
  });

  const handleSaveProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'brandName' | 'categoryName'>) => {
    const brand = brands.find(b => b.id === productData.brandId);
    const category = categories.find(c => c.id === productData.categoryId);
    
    if (editProduct) {
      setProducts(products.map(product =>
        product.id === editProduct.id
          ? { 
              ...productData, 
              id: product.id, 
              createdAt: product.createdAt,
              brandName: brand?.name || '',
              categoryName: category?.name || ''
            }
          : product
      ));
      setEditProduct(null);
    } else {
      const newProduct: Product = {
        ...productData,
        id: Date.now().toString(),
        brandName: brand?.name || '',
        categoryName: category?.name || '',
        createdAt: new Date().toISOString(),
      };
      setProducts([...products, newProduct]);
    }
    setProductDialogOpen(false);
  };

  const handleSaveBrand = (brandData: Omit<Brand, 'id' | 'createdAt'>) => {
    if (editBrand) {
      setBrands(brands.map(brand =>
        brand.id === editBrand.id ? { ...brandData, id: brand.id, createdAt: brand.createdAt } : brand
      ));
      setEditBrand(null);
    } else {
      const newBrand: Brand = { ...brandData, id: Date.now().toString(), createdAt: new Date().toISOString() };
      setBrands([...brands, newBrand]);
    }
    setBrandDialogOpen(false);
  };

  const handleSaveCategory = (categoryData: Omit<Category, 'id' | 'createdAt'>) => {
    if (editCategory) {
      setCategories(categories.map(category =>
        category.id === editCategory.id ? { ...categoryData, id: category.id, createdAt: category.createdAt } : category
      ));
      setEditCategory(null);
    } else {
      const newCategory: Category = { ...categoryData, id: Date.now().toString(), createdAt: new Date().toISOString() };
      setCategories([...categories, newCategory]);
    }
    setCategoryDialogOpen(false);
  };

  const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const lowStockCount = products.filter(p => p.quantity <= p.minStock && p.quantity > 0).length;
  const outOfStockCount = products.filter(p => p.quantity === 0).length;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        
        <div className="flex-1 overflow-auto bg-gray-50 p-8">
          <div className="mx-auto max-w-7xl space-y-8">    
        <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Products Management</h1>
                <p className="text-muted-foreground">Manage products, brands, and categories</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => { setEditCategory(null); setCategoryDialogOpen(true); }}>
                  <FolderTree className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
                <Button variant="outline" onClick={() => { setEditBrand(null); setBrandDialogOpen(true); }}>
                  <Tag className="mr-2 h-4 w-4" />
                  Add Brand
                </Button>
                <Button onClick={() => { setEditProduct(null); setProductDialogOpen(true); }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-green-600">
                  Rs. {totalValue.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-orange-600">{lowStockCount}</p>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold">Brands ({brands.length})</h3>
                  <Button size="sm" variant="ghost" onClick={() => { setEditBrand(null); setBrandDialogOpen(true); }}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {brands.map((brand) => (
                    <Badge key={brand.id} variant="outline" className="cursor-pointer hover:bg-gray-100">
                      {brand.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold">Categories ({categories.length})</h3>
                  <Button size="sm" variant="ghost" onClick={() => { setEditCategory(null); setCategoryDialogOpen(true); }}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge key={category.id} variant="outline" className="cursor-pointer hover:bg-gray-100">
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">All Products</h2>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, SKU, brand, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterBrand} onValueChange={setFilterBrand}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <ProductsTable
                products={filteredProducts}
                onEdit={(product) => { setEditProduct(product); setProductDialogOpen(true); }}
                onDelete={(id) => setProducts(products.filter(p => p.id !== id))}
              />
            </div>

            <AddProductDialog
              open={productDialogOpen}
              onOpenChange={setProductDialogOpen}
              onSave={handleSaveProduct}
              editProduct={editProduct}
              brands={brands}
              categories={categories}
            />

            <AddBrandDialog
              open={brandDialogOpen}
              onOpenChange={setBrandDialogOpen}
              onSave={handleSaveBrand}
              editBrand={editBrand}
            />

            <AddCategoryDialog
              open={categoryDialogOpen}
              onOpenChange={setCategoryDialogOpen}
              onSave={handleSaveCategory}
              editCategory={editCategory}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
