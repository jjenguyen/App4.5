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
// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { Post } from './post.interface';
// import { HttpClient } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root'
// })
// export class PostService {
//   private apiUrl = 'http://localhost:3000/posts';
//   private posts: Post[] = [];
//   private postsSubject: BehaviorSubject<Post[]> = new BehaviorSubject([]);

//   constructor(private http: HttpClient) { }

//   // 1. methods to handle local posts
//   // add new posts locally
//   addPost(post: Post): void {
//     // assign incremental title for each post created
//     post.title = `Post ${this.posts.length + 1}`
//     this.posts.push(post);
//     // update BehaviorSubject
//     this.postsSubject.next([...this.posts]);
//   }

//   // get locally created posts
//   getPosts(): Observable<Post[]> {
//     return this.postsSubject.asObservable();
//   }

//   // 2. methods to handle Node.js server
  // // fetch hardcoded data
  // fetchPostsFromServer(): void {
  //   this.http.get<Post[]>(this.apiUrl).subscribe(posts => {
  //     this.posts = posts;
  //     this.postsSubject.next([...this.posts]);
  //   });
  // }

//   // add new post and send to Node.js server
//   addPostToServer(post: Post): Observable<Post> {
//     return this.http.post<Post>(this.apiUrl, post);
//   }
// }

// webdev final project: task management
// import { Injectable } from '@angular/core';
// import { Post } from './post.interface';
// import { Login } from './post.interface';
// import { Subject, Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { HttpClient } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root'
// })
// export class PostService {
//   private posts: Post[] = [];
//   private postUpDate = new Subject<Post[]>();

//   constructor(private http: HttpClient) {}

//   getPosts(): Observable<Post[]> {
//     return this.http.get<{ message: string, posts: any[] }>('http://localhost:3000/posts')
//       .pipe(
//         map(data => data.posts.map(post => ({
//           id: post._id,
//           title: post.title,
//           date: post.date,
//           category: post.category,
//           content: post.content
//         })))
//       );
//   }

//   addPost(title: string, date: string, category: string, content: string) {
//     const post: Post = { id: null, title, date, category, content };
//     this.http.post<{ message: string }>('http://localhost:3000/posts', post).subscribe(() => {
//       console.log('Post added successfully');
//     });
//   }

//   deletePost(postId:string){
//     this.http.delete("http://localhost:3000/posts/"+postId).subscribe(()=>{
//       const updatedPost = this.posts.filter(post => post.id !== postId)
//       this.posts = updatedPost
//       this.postUpDate.next([...this.posts])
//       console.log("Post Deleted")
//     })
//     }
// }

// trying to fix task delete not updating, adjusted and successful, had to alter logic
import { Injectable } from '@angular/core';
import { Post } from './post.interface';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  private postUpdate = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<{ message: string, posts: any[] }>('http://localhost:3000/posts')
      .pipe(
        map(data => data.posts.map(post => ({
          id: post._id,
          title: post.title,
          date: post.date,
          category: post.category,
          content: post.content
        })))
      );
  }

  getNewTasks(): Observable<Post[]> {
    return this.http.get<{ message: string, posts: any[] }>('http://localhost:3000/posts/new-tasks')
      .pipe(
        map(data => data.posts.map(post => ({
          id: post._id,
          title: post.title,
          date: post.date,
          category: post.category,
          content: post.content
        })))
      );
  }

  addPost(title: string, date: string, category: string, content: string) {
    const post: Post = { id: null, title, date, category, content };
    this.http.post<{ message: string }>('http://localhost:3000/posts', post).subscribe(() => {
      console.log('Post added successfully');
    });
  }

  deletePost(postId: string): Observable<void> {
    return this.http.delete<void>('http://localhost:3000/posts/' + postId);
  }

  getPostUpdateListener(): Observable<Post[]> {
    return this.postUpdate.asObservable();
  }
}