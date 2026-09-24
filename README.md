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

<!-- ?? Should the user Id be handled with the like so we can only like a button once, if click again then dislike -->
<!-- ! Loading state for like button to disable multiple press -->
<!-- !: reset the database ID -->
<!-- ! Create a TS file to handle the types, share across files  -->

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

-> Improve user experience with loading state, better alert with toast
-> Reply (UI)
-> Authentification

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

## Credits
react-hot-toast
Lucid
Drizzle ORM
Tailwind CSS
