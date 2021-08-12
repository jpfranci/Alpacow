# Alpacow 🐮

## 1. Project Description

Alpacow is a location-based social news web app that allows users to create and interact with posts. The app aims to provide an online forum experience with up-to-date content from users in the same geographical location. 

## 2. Goals

### Minimal Requirements

- Create users ✔️ 
  - Create user creation form UI ✔️ (with form validation✨)
  - Create user update/deletion form UI ✔️ (no deletion, but who would want to stop using Alpacow?  🚧) 
  - Create CRUD endpoints ✔️ 
  - Implement secure way of storing personal data (email/password) ✔️ 
- Create/View posts ✔️ 
  - Post creation form UI ✔️ (with form validation✨)
  - Interactions with posts (upvotes / downvotes) ✔️ 
  - Implement endpoints / data ✔️ (with request validation✨) 
- Get location of posts (or prompt users to enter location) ✔️ 

### Standard Requirements

- Choose location with autocomplete ✔️ (and by dragging a marker ✨)
- Vote on posts ✔️  (and comments ✨)
- Comment on each other’s posts ✔️ 
- Personalize post recommendations based on location ✔️ 
- Personalize post recommendations based on upvotes ✔️ 
- User reputation ✔️ 
- Post tags (search posts by tag) ✔️ 

### Stretch Requirements

- Cash/crypto gifting system (JipTip) ❌
- Cooler interactions with posts (emoji reacts) ❌
- Hot reload posts (show replies as they come in) ❌ (new posts are shown after creation, but not replies 🚧)

## 3. Description of Tech

#### Unit 1 - HTML, CSS, JS

We used **styled-components** to style our React components in code. Styled-components use tagged template literals to style components (which basically looks like CSS surrounded by backticks). This allowed us to write CSS in TypeScript easily; it removed the worry for class name errors, allowed us to extend styles for reusability, and made deletion of CSS used in multiple places simple.

We also opted for **TypeScript** over JavaScript on the front-end thanks to its static error-checking, type-checking, and improvements to code readability/understandability. We took advantage of type inference where possible and stuck to primitive over general types. We also used union types and optional parameters whenever possible over creating multiple overloads of the same function.

#### Unit 2 - React

We used primarily functional **React** components. Of course, we maintained the state of our UI on the frontend, and we took advantage of our reusable react components wherever possible, such as the TagSearch component (used in the home page and post creation UI) and PostList component (home page and view profile dialog/page).

We also divided that state on the front end by using **Redux**. Essentially, it allowed us to keep information related to a user’s session, such as their login state and post filters, separate from state that was more relevant to the UI, all while keeping that user information accessible across the front-end application. This made handling state more modular, and easier to conceptualize while implementing new features.

#### Unit 3 - Node & Express

We used **Express**, a **Node.js** web app framework, for our backend. It handled database operations with our **MongoDB** to store posts, tags, users, and perform validation on data for various endpoints. It also handled queries for listing posts, listing tags, and viewing user information.

We trusted no user request and used Express middleware on every api request to make sure that request payloads were well formed and to verify that user session cookies are valid for requests that require authentication such as post creation. Any requests with a bad payload were responded with a 400 Bad Request error with the specifics of what the malformed payload was, while any unauthorized request was responded with a 401 Forbidden error. 

#### Unit 4 - NoSQL with MongoDB
When designing our database schema in MongoDB, we made indices of fields that are queried often such as the user id of a user that created a post or whether a post contains mature content and unique indices for fields such as usernames and emails. We also nested documents when possible to ensure that operations in a document were atomic and included extra data such as usernames in our post schema to minimize the number of queries to fetch data. 

In our queries, we tried to accomplish as much in one atomic transaction as possible by using a pipeline of filters and aggregations for more complex queries rather than splitting it into multiple queries that could fall prey to race conditions. This helped us maintain invariants in our data such as the invariant that users can only vote on a particular post or comment once. 

#### Unit 5 - Release Engineering

We used **Lerna** to easily manage our client and server packages including dependency installation, data generation, hot reloading of both packages using one command, and CI/CD build scripts. On every push to main, we run a Lerna script, `heroku-postbuild`, to install all dependencies in both server and client packages and build the client files into static bundles that the server can serve to the client. After building, we run a `start-prod` script, which sets the necessary environment variables to start the server in production mode, which means masking internal server errors and disabling hot reload. We also used **Heroku** to deploy the app.

## 4. Above and Beyond Functionality
To go above and beyond, we considered security implications for our forms by adding client-side form validation to all of our UIs, such as login, sign up, and post creation, using a third party library called **React Hook Form**. Our form validation ensures form inputs are formatted as expected and can be fixed by the user before the form reaches the backend.

We used additional third party technologies like **Firebase** to handle authentication, store credentials, and use session cookies for logins. We also created authentication error codes for surfacing more specific information about errors from the backend. 

To filter mature content contained in posts and comments, we used **Microsoft Azure’s content moderator API**, and implemented a switch for viewing mature content (posts and comments). 

On the backend, we also performed schema validation with **Joi** on incoming requests. This benefitted the app by validating data at the application level before sending that data to our database.

Finally we used location services to filter posts based on the distance from the current user to the coordinates (location) of where the post was made.

## 5. Next Steps

The next natural step would be to allow users to delete and edit their posts and comments. To make the forum experience more engaging, we would look into hot reloading posts and comments to provide users with live updates on new content, as well as supporting more personalized interactions (e.g. emoji reacts). We considered implementing reports for offensive/malicious posts or users. We also envisioned a cash and crypto gifting system to allow users to show support for their favourite Alpacow content (JipTip).


# 6. Contributions

### Daniel Y Liu 

I designed and implemented mainly the front-end dialog components for creating posts, logging in, and signing up. I also worked on form validation, as well as designing and hooking up the view/edit profile page. The logo was also drawn by me. 🐮

### Daniel Ryu

Frontend-wise, I set up our frontend's state management architecture with Redux and implemented various post related workflows such as post voting. To support these workflows I built endpoints in the backend so our data would persist in the database. I also handled our application's deployment to Heroku.

### John Paul Francisco

I created the schemas for our MongoDB collections, created MongoDB queries for post and user fetching, and created a highly configurable script that populates our database with fake data from Reddit. I setup the middleware in the backend, including validation of incoming requests using Joi schemas and session token validation for privileged requests such as creating a post. I also setup Firebase authentication and setup error handling in our app to handle it gracefully, showing user friendly messages when possible.

### Sarah Li

Some interesting parts of the project I worked on include setting location using the map component and moderating text in posts/comments. I also worked on the profile view, updating user reputation in the backend, and connecting our app to a shared database on Atlas. 🌱


## Prototypes

### Main Screen with Posts

![main screen posts](https://user-images.githubusercontent.com/43103720/122508610-1698a780-cfb7-11eb-8e9f-a4cfe1a91da0.jpg)

Shown are key features including voting on posts with the most reputable being shown first to the user.
It also includes the navigation bar where the user can further filter posts and also visit/edit their profile.
Users can click on the replies text to view replies and participate.


### Create a Post Screen

![image](https://user-images.githubusercontent.com/43103720/122508683-38922a00-cfb7-11eb-8995-ccaf1771df70.png)

Shown is the screen where you can create a new post with an optional title and anonymity options.
