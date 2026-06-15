import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendingTrendChartComponent } from './spending-trend-chart.component';

describe('SpendingTrendChartComponent', () => {
  let component: SpendingTrendChartComponent;
  let fixture: ComponentFixture<SpendingTrendChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpendingTrendChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpendingTrendChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
