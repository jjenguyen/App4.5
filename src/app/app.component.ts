import { Component } from '@angular/core';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.css'
// })
// export class AppComponent {
//   title = 'Assignment3App-jn4gz';

//   posts: { content: string, date: Date }[] = [];

//   addPost(newPost: { content: string, date: Date }) {
//     this.posts.push(newPost);
//   }
// }

// draft 2: without using header component to route
// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent {
//   title = 'Assignment4App-jn4gz';

//   isLoggedIn: boolean = false;
//   displayRegisterForm: boolean = false;
//   displayLoginForm: boolean = false;

//   onLoginSuccess(event: boolean) {
//     this.isLoggedIn = event;
//   }

//   toggleRegisterForm() {
//     this.displayRegisterForm = !this.displayRegisterForm;
//   }

//   toggleLoginForm() {
//     this.displayLoginForm = !this.displayLoginForm;
//   }  
// }

// draft 3: using header component to route
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Assignment3App-jn4gz';

  isLoggedIn: boolean = false;

  onLoginSuccess(event: boolean) {
    this.isLoggedIn = event;
  }
}