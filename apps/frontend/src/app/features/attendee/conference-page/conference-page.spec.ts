import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConferencePage } from './conference-page';

describe('ConferencePage', () => {
  let component: ConferencePage;
  let fixture: ComponentFixture<ConferencePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConferencePage],
    }).compileComponents();

    fixture = TestBed.createComponent(ConferencePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
