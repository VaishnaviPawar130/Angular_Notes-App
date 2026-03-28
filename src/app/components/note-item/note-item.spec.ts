import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteItemComponent } from './note-item';

describe('NoteItemComponent', () => {
  let component: NoteItemComponent;
  let fixture: ComponentFixture<NoteItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NoteItemComponent);
    component = fixture.componentInstance;
    component.note = {
      id: '1',
      text: 'Test note',
      createdAt: Date.now(),
      pinned: false,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
