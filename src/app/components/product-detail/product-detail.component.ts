import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  rating: number;
  stock: number;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  quantity = 1;

  // Mock products data
  private mockProducts: Product[] = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 99.99,
      description: 'High-quality wireless headphones with noise cancellation',
      image: 'https://via.placeholder.com/400x300',
      category: 'Electronics',
      rating: 4.5,
      stock: 15
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 299.99,
      description: 'Advanced smartwatch with health monitoring features',
      image: 'https://via.placeholder.com/400x300',
      category: 'Electronics',
      rating: 4.8,
      stock: 8
    },
    {
      id: 3,
      name: 'Running Shoes',
      price: 79.99,
      description: 'Comfortable running shoes for all terrains',
      image: 'https://via.placeholder.com/400x300',
      category: 'Sports',
      rating: 4.3,
      stock: 25
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProduct();
  }

  private loadProduct(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    // Simulate API call delay
    setTimeout(() => {
      this.product = this.mockProducts.find(p => p.id === id) || null;
      this.loading = false;
    }, 500);
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart({
        id: this.product.id,
        name: this.product.name,
        price: this.product.price,
        image: this.product.image
      });
      alert('Product added to cart!');
    }
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  getStarArray(): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }
}
