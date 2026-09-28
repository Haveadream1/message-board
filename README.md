# message-board
(Badge + description)


## Project description
We use EJS views, allow us to have HTML template in rendered in the server

(GIF)

## Live Demo

## Features

## Technology stack and tools
For this project we will use Tailwindcss, Express, React and Typescript, PostgreSQL via NEON, ORM (Prisma)

## Installation
### Prerequisites
### Installation guide

## Testing guide

## Project structure

## API documentation

## To-dos
* Like count update should have a loader animation
    * Maybe the hear can do something
    * Or optimistic UI ?
* Add media-queries or box

<!-- !: reset the database ID -->
<!-- TODO: Create a TS file to handle the types, share across files  -->
<!-- ! Change JWT in production to env file -->
<!-- TODO: verify semantic -->
<!-- TODO: define terms and conditions -->
<!-- ?? Using required on auth but not on messages-> need  to nake a choice for the 2 -->
<!-- TODO: refactor message form as we have now auth -->
<!-- TODO: Check path / to be enable on all devices -->

### Milestones
* Create home page layout
* Style header
* Create layout for message
* Style the message component
* Add responsiveness
* Create a backend branch
* Install backend dependencies
* Create form component -> Input validation + handle submit
* Create the GET/POST/Health routes
* Handle the routes in the frontend to store/fetch data
* Display error state
* Connect to database PostgreSQL via NEON
* Use Drizzle ORM, to introduce type-safe query
* Create the PUT/DELETE route
* Improve user experience with loading state, better alert with toast, confirmation on deletion
* Implement authentification with JWS tokens and password hashing
* Create authentication middleware -> stateless authentication (server doesn't keep the session in memory)
* Implement authorization for delete route -> can now only delete own messages !
* Implement anti-span for likes
* Create auth (register) form
* Handle login/register routes with context
* Refactor auth form with components
* Attaches the token in the header of the request
* Refactor MsgForm
* Create route for login/register with react-router
* Error page
* Display only delete icon for message matching userId with message's owner

-> Login with tiers
-> Pagination
-> Refactor style with a component library
-> Display already liked likes
-> Remove likes
-> Reply (UI)
-> Reply logic

Authorization (who are you?) vs Authentication (what are you allowed to do?)
Links for actual DOM element and navigate for logic

### Notes
* Remove client readme
* Like a forum, so a section and then discussions about it 
* We only pass the user input into the backend, and create the message object inside the backend, as the frontend data can be manipulated !

Should display message with an order, so we can modify it when we reply, the hierarchy will then be modifed

/*
Message-Dashboard
* Like a stackOverflow thread
* Button to add a new message and display of the thread's messages
* Once clicked, form pop-up (Non-registered user username and message)
* Basic form validation to check non-empty inputs, retrieve the values and store it to an array of obj [{username: , message: },..]
* Display all the messages from the array (implement pagination or limitation later) 
*/

1. Create all the logic for simply send a message and fetch message from a particular section
2. Allow answer to a particular message in a section
3. Allow to create and discover section

Start with name input and then move to profile with authentification ?
Then we can have 2 options: Post like a guest or registered user

Each messages:
* Author / Date 
* Reply option
* Like option
* If own message
    * Edit / Delete 

// JWT token contains all the session details (user info), without the need to store it in the server -> stateless
// The authentification is then done by only checking the token signature with the secrete key
// Tested with `Thunder client` by creating a POST request with path and body (username, password)
// -The goal of the JWT in the login route is to give the frontend a cryptographically signed "Proof of Identity" that it can use for all future requests.

## Credits
react-hot-toast
Lucid
Drizzle ORM
Tailwind CSS
PostgreSQL with Neon
bcrypt (hash passwords)
jsonwebtoken JWT (generate secure token -> proves usre is logged)
Thunder client (mock API request)