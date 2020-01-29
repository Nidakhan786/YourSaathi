import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AnonycounselPage } from './anonycounsel.page';

describe('AnonycounselPage', () => {
  let component: AnonycounselPage;
  let fixture: ComponentFixture<AnonycounselPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnonycounselPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AnonycounselPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
