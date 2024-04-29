// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { Post } from './post.interface';
// import { HttpClient } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root'
// })
// export class PostService {
//   private posts: Post[] = [];
//   private postsSubject: BehaviorSubject<Post[]> = new BehaviorSubject([]);

//   constructor() { }

//   addPost(post: Post) {
//     // assign incremental title for each post created
//     post.title = `Post ${this.posts.length + 1}`
//     this.posts.push(post);
//     // Update BehaviorSubject
//     this.postsSubject.next([...this.posts]);
//   }

//   getPosts(): Observable<Post[]> {
//     return this.postsSubject.asObservable();
//   }
// }

// with node
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Post } from './post.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:3000/posts';
  private posts: Post[] = [];
  private postsSubject: BehaviorSubject<Post[]> = new BehaviorSubject([]);

  constructor(private http: HttpClient) { }

  // 1. methods to handle local posts
  // add new posts locally
  addPost(post: Post): void {
    // assign incremental title for each post created
    post.title = `Post ${this.posts.length + 1}`
    this.posts.push(post);
    // update BehaviorSubject
    this.postsSubject.next([...this.posts]);
  }

  // get locally created posts
  getPosts(): Observable<Post[]> {
    return this.postsSubject.asObservable();
  }

  // 2. methods to handle Node.js server
  // fetch hardcoded data
  fetchPostsFromServer(): void {
    this.http.get<Post[]>(this.apiUrl).subscribe(posts => {
      this.posts = posts;
      this.postsSubject.next([...this.posts]);
    });
  }

  // add new post and send to Node.js server
  addPostToServer(post: Post): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post);
  }
}