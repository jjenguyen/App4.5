// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { PostService } from '../post.service';
// import { Subscription } from 'rxjs';
// import { Post } from '../post.interface';

// before node
// @Component({
//   selector: 'app-post-list',
//   templateUrl: './post-list.component.html',
//   styleUrls: ['./post-list.component.css']
// })
// export class PostListComponent implements OnInit, OnDestroy {
//   posts: Post[] = [];
//   private postsSubscription: Subscription;
//   private serverPostsSubscription: Subscription;

//   constructor(private postService: PostService) {}

//   ngOnInit() {
//     this.postsSubscription = this.postService.getPosts().subscribe(posts => {
//       // update copy of the array
//       this.posts = [...posts];
//     });
//   }

//   ngOnDestroy() {
//     // unsubscribe to avoid memory leaks
//     this.postsSubscription.unsubscribe();
//   }
// }

// node attempt 1
// @Component({
//   selector: 'app-post-list',
//   templateUrl: './post-list.component.html',
//   styleUrls: ['./post-list.component.css']
// })
// export class PostListComponent implements OnInit, OnDestroy {
//   posts: Post[] = [];
//   private postsSubscription: Subscription;
//   private serverPostsSubscription: Subscription;

//   constructor(private postService: PostService) {}

//   ngOnInit() {
//     // subscribe to local posts
//     this.postsSubscription = this.postService.getPosts().subscribe(posts => {
//       // update copy of the array
//       this.posts = [...posts];
//     });

//     // fetch posts from Node.js server
//     this.postService.fetchPostsFromServer();

//     // subscribe to server posts
//     this.serverPostsSubscription = this.postService.getPosts().subscribe(posts => {
//       // appending server posts to the existing local posts
//       this.posts = [...this.posts, ...posts];
//     });
//   }

//   ngOnDestroy() {
//     // unsubscribe to avoid memory leaks
//     this.postsSubscription.unsubscribe();
//     this.serverPostsSubscription.unsubscribe();
//   }
// }

// node attempt 2
// seems subscription to server cause duplication
// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { PostService } from '../post.service';
// import { Subscription } from 'rxjs';
// import { Post } from '../post.interface';

// @Component({
//   selector: 'app-post-list',
//   templateUrl: './post-list.component.html',
//   styleUrls: ['./post-list.component.css']
// })
// export class PostListComponent implements OnInit, OnDestroy {
//   posts: Post[] = [];
//   private postsSubscription: Subscription;
//   private serverPostsSubscription: Subscription;

//   constructor(private postService: PostService) {}

//   ngOnInit() {
//     // subscribe to local posts
//     this.postsSubscription = this.postService.getPosts().subscribe(posts => {
//       // update copy of the array
//       this.posts = [...posts];
//     });

//     // fetch posts from Node.js server
//     this.postService.fetchPostsFromServer();
//   }

//   ngOnDestroy() {
//     // unsubscribe to avoid memory leaks
//     this.postsSubscription.unsubscribe();
//     if (this.serverPostsSubscription) {
//       this.serverPostsSubscription.unsubscribe();
//     }
//   }
// }

// webdev final project: task management
// readjusted, had to alter deletion updating logic
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { PostService } from "../post.service";
import { Post } from "../post.interface";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub: Subscription;
  private postUpdateSub: Subscription;

  constructor(public postsService: PostService) {}

  ngOnInit() {
    this.postsSub = this.postsService.getPosts().subscribe(posts => {
      this.posts = posts;
      console.log('Fetched posts:', posts);
    });

    this.postUpdateSub = this.postsService.getPostUpdateListener().subscribe({
      next: (updatedPosts: Post[]) => {
        console.log('Updated posts after deletion:', updatedPosts);
        this.posts = updatedPosts;
      },
      error: (error) => {
        console.error('Error updating posts:', error);
      }
    });
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId).subscribe({
      next: () => {
        // filter out the deleted post from the posts array
        this.posts = this.posts.filter(post => post.id !== postId);
        console.log('Post deleted successfully');
      },
      error: error => {
        console.error('Error deleting post:', error);
      }
    });
  }  
  
  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.postUpdateSub.unsubscribe();
  }
}