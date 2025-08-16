import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IProduct, ICategory } from '../../models';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements OnInit {
  products: IProduct[] = [];
  categories: ICategory[] = [];
  filteredProducts: IProduct[] = [];
  selectedCategoryId: number = 0;

  constructor() {}

  ngOnInit(): void {
    this.initializeCategories();
    this.initializeProducts();
    this.filteredProducts = this.products;
  }

  initializeCategories(): void {
    this.categories = [
      { id: 0, name: 'All Categories', description: 'View all products' },
      { id: 1, name: 'Electronics', description: 'Electronic devices and gadgets' },
      { id: 2, name: 'Clothing', description: 'Fashion and apparel' },
      { id: 3, name: 'Books', description: 'Books and educational materials' },
      { id: 4, name: 'Sports', description: 'Sports equipment and accessories' }
    ];
  }

  initializeProducts(): void {
    this.products = [
      { 
        id: 1, 
        name: 'Smartphone', 
        description: 'Latest model smartphone with amazing features', 
        price: 599.99, 
        imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDA3YmZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+U21hcnRwaG9uZTwvdGV4dD48L3N2Zz4=', 
        categoryId: 1, 
        inStock: true, 
        rating: 4.5 
      },
      { 
        id: 2, 
        name: 'Laptop', 
        description: 'High-performance laptop for work and gaming', 
        price: 999.99, 
        imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjhhNzQ1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TGFwdG9wPC90ZXh0Pjwvc3ZnPg==', 
        categoryId: 1, 
        inStock: true, 
        rating: 4.8 
      },
      { 
        id: 3, 
        name: 'T-Shirt', 
        description: 'Comfortable cotton t-shirt in various colors', 
        price: 19.99, 
        imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGMzNTQ1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VC1TaGlydDwvdGV4dD48L3N2Zz4=', 
        categoryId: 2, 
        inStock: true, 
        rating: 4.2 
      },
      { 
        id: 4, 
        name: 'Jeans', 
        description: 'Classic blue jeans with perfect fit', 
        price: 49.99, 
        imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNmM3NTdkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SmVhbnM8L3RleHQ+PC9zdmc+', 
        categoryId: 2, 
        inStock: false, 
        rating: 4.0 
      },
      { 
        id: 5, 
        name: 'Programming Book', 
        description: 'Learn programming with this comprehensive guide', 
        price: 39.99, 
        imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZjMTA3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9ImJsYWNrIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Qm9vazwvdGV4dD48L3N2Zz4=', 
        categoryId: 3, 
        inStock: true, 
        rating: 4.7 
      },
      { 
        id: 6, 
        name: 'Football', 
        description: 'Professional quality football for sports enthusiasts', 
        price: 29.99, 
        imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTdhMmI4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Rm9vdGJhbGw8L3RleHQ+PC9zdmc+', 
        categoryId: 4, 
        inStock: true, 
        rating: 4.3 
      },
      { 
        id: 7, 
        name: 'Headphones', 
        description: 'Wireless noise-canceling headphones', 
        price: 199.99, 
        imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNmY0MmMxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SGVhZHBob25lczwvdGV4dD48L3N2Zz4=', 
        categoryId: 1, 
        inStock: true, 
        rating: 4.6 
      },
      { 
        id: 8, 
        name: 'Running Shoes', 
        description: 'Comfortable running shoes for daily workouts', 
        price: 89.99, 
        imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmQ3ZTE0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+U2hvZXM8L3RleHQ+PC9zdmc+', 
        categoryId: 4, 
        inStock: true, 
        rating: 4.4 
      }
    ];
  }

  onCategoryChange(): void {
    const categoryId = Number(this.selectedCategoryId);
    if (categoryId === 0) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product => product.categoryId === categoryId);
    }
  }

  getStarsArray(rating: number): number[] {
    const fullStars = Math.floor(rating);
    return Array(5).fill(0).map((_, index) => index < fullStars ? 1 : 0);
  }

  getSelectedCategoryName(): string {
    const category = this.categories.find(c => c.id === this.selectedCategoryId);
    return category ? category.name : '';
  }
}
