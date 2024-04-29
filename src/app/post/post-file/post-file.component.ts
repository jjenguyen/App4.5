import { Component } from '@angular/core';
import { PostService } from '../post.service';
import { Post } from '../post.interface';

@Component({
  selector: 'app-post-file',
  templateUrl: './post-file.component.html',
  styleUrls: ['./post-file.component.css']
})
export class PostFileComponent {
  postTitle: string
  postContent: string;

  constructor(private postService: PostService) {}

  submitPost() {
    if (!this.postContent || this.postContent.trim() === '') {
      return;
    }
    const newPost: Post = {
      title: this.postTitle,
      content: this.postContent
    };
    this.postService.addPost(newPost);
    this.postContent = '';
  }
}