// import { Component } from '@angular/core';
// import { PostService } from '../post.service';
// import { Post } from '../post.interface';

// @Component({
//   selector: 'app-post-file',
//   templateUrl: './post-file.component.html',
//   styleUrls: ['./post-file.component.css']
// })
// export class PostFileComponent {
//   postTitle: string
//   postContent: string;

//   constructor(private postService: PostService) {}

//   submitPost() {
//     if (!this.postContent || this.postContent.trim() === '') {
//       return;
//     }
//     const newPost: Post = {
//       title: this.postTitle,
//       content: this.postContent
//     };
//     this.postService.addPost(newPost);
//     this.postContent = '';
//   }
// }

// webdev final project: task management
// import { Component, EventEmitter, Output } from '@angular/core';
// import { NgForm } from '@angular/forms';
// import { Post } from '../post.interface';
// import { PostService } from '../post.service';

// @Component({
//     selector: 'app-post-file',
//     templateUrl: './post-file.component.html',
//     styleUrls: ['./post-file.component.css']
//   })

// export class PostFileComponent {

//     tasktitle: '';
//     taskdate: '';
//     taskcategory: '';
//     taskcontent: '';

//   randomString = "No Content";
//   binding = '';

//   // @Output() postCreated = new EventEmitter();

//   constructor(public postsService: PostService) {

//   }

//   onAddPost(form: NgForm){  // needs to be made async to use await
//     if(form.invalid){
//       return;
//     }

//     // get name of current user
//     // currentUser = ''

//     const post: Post = {  // do we need anything in this here besides title for post-response?
//       title: form.value.title,
//       content: form.value.content,
//       date: form.value.date,
//       category: form.value.category,
//       id: null,
//     };

//     // need to make schema declarations visible to this file
//     // await postSchema.create({username: currentUser, title: post.title, date: post.date, category: post.category, content: post.content})

//     this.postsService.addPost(form.value.title, form.value.date, form.value.category, form.value.content);
//     form.resetForm();
//   }
// }

// adjusted after implementing task management, added local storage of posts (tasks) created locally to display to user
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../post.interface';
import { PostService } from '../post.service';

@Component({
    selector: 'app-post-file',
    templateUrl: './post-file.component.html',
    styleUrls: ['./post-file.component.css']
})
export class PostFileComponent implements OnInit {

    tasktitle: string = '';
    taskdate: string = '';
    taskcategory: string = '';
    taskcontent: string = '';

    // define an array to store locally created tasks
    localTasks: Post[] = [];

    constructor(public postsService: PostService) {}

    ngOnInit(): void {
        // retrieve locally created tasks from local storage when component initializes
        const localTasksString = localStorage.getItem('localTasks');
        if (localTasksString) {
            this.localTasks = JSON.parse(localTasksString);
        }
    }

    onAddPost(form: NgForm) {
        if (form.invalid) {
            return;
        }

        const post: Post = {
            title: form.value.title,
            content: form.value.content,
            date: form.value.date,
            category: form.value.category,
            id: null,
        };

        // add the new task to the local tasks array and store it in local storage
        this.localTasks.push(post);
        localStorage.setItem('localTasks', JSON.stringify(this.localTasks));

        // call the service method to add the task to the server
        this.postsService.addPost(form.value.title, form.value.date, form.value.category, form.value.content);
        form.resetForm();
    }

    ngOnDestroy(): void {
      // clear the list of locally created tasks when the component is destroyed - so it only includes new tasks for the duration you're on the form page
      localStorage.removeItem('localTasks');
  }
}