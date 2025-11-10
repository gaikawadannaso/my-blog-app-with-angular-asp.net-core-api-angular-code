import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogCommentsComponent } from './blog-comments.component';

describe('BlogCommentsComponent', () => {
  let component: BlogCommentsComponent;
  let fixture: ComponentFixture<BlogCommentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlogCommentsComponent]
    });
    fixture = TestBed.createComponent(BlogCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
