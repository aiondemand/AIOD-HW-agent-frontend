import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewConfigComponent } from './new-config.component';

describe('NewConfigComponent', () => {
  let component: NewConfigComponent;
  let fixture: ComponentFixture<NewConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
