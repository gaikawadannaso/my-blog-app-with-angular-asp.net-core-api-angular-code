import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Chart, PieController, LineController, ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { CategoryService } from '../../category/services/category.service';
import { Dashboard } from '../../category/models/dashboard.model';
import { Subscription } from 'rxjs';

Chart.register(PieController, LineController, ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private categoryService : CategoryService){}

  paramSubscription?: Subscription;
  editCategorySubscription?: Subscription;
  dashboard?: Dashboard;

  draftCount: number = 0;

  cards: any[] = [];

  ngOnInit(): void {
    this.categoryService.getDashboardData().subscribe({
      next: (response) => {
        this.dashboard = response;

        this.cards = [
          { count: this.dashboard.blogCount, routeTo:'/admin/blogposts', label: 'Total Blogs', icon: '📝', bgClass: 'bg-primary' },
          { count: this.dashboard.publishedCount, routeTo:'/admin/blogposts', label: 'Published', icon: '✅', bgClass: 'bg-success' },
          { count: this.dashboard.categoryCount,routeTo :'/admin/categories', label: 'Categories', icon: '📂', bgClass: 'bg-warning' },
          { count: this.dashboard.userCount, routeTo:'/admin/dashboard', label: 'Users', icon: '👤', bgClass: 'bg-danger' }
        ];

        this.renderCharts();
      }
    });
  }

  

  renderCharts() {
    this.draftCount = (this.dashboard?.blogCount || 0) - (this.dashboard?.publishedCount || 0);
    new Chart('blogPieChart', {
      type: 'pie',
      data: {
        labels: ['Published','Unpublished', 'Total Blogs'],
        datasets: [{
          data: [
            this.dashboard?.publishedCount || 0,
            this.draftCount,
            this.dashboard?.blogCount || 0
          ],
          backgroundColor: ['#0dcaf0', '#FF8DA1','#ffc107'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });

    new Chart('blogLineChart', {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Blogs Published',
          data: [5, 10, 8, 15, 20, 25], 
          borderColor: '#007bff',
          backgroundColor: 'rgba(0,123,255,0.3)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}
