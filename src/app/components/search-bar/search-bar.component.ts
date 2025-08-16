import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  @Output() searchChange = new EventEmitter<string>();
  
  searchTerm: string = '';
  isSearching: boolean = false;

  onSearchInput(): void {
    this.isSearching = this.searchTerm.length > 0;
    this.searchChange.emit(this.searchTerm);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.isSearching = false;
    this.searchChange.emit('');
  }
}
