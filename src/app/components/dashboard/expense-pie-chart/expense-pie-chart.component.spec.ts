import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensePieChartComponent } from './expense-pie-chart.component';

describe('ExpensePieChartComponent', () => {
  let component: ExpensePieChartComponent;
  let fixture: ComponentFixture<ExpensePieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensePieChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpensePieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
