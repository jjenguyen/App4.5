import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostFileComponent } from './post-file.component';

describe('PostFileComponent', () => {
  let component: PostFileComponent;
  let fixture: ComponentFixture<PostFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostFileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
