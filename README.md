# AI Email composer
A simple demo web app allowing users to generate and send emails with AI. It uses Vercel AI SDK for generating emails depending on what type of input the user has passed. An AI routing assistant determines, depending on the input passed by the user, if the generated email should be a sales email (brief, 7-10 word sentences, with a professional tone) or a follow-up email (longer sentences with a more warm and friendly approach). Different AI models are used for the follow-up emails and sales emails.

# Structure
This is a monorepo. It has two folders:  
1. `frontend`: This is the frontend of the application. It is built using Next.js.  
2. `backend`: This is the backend of the application. It is built using Fastify.

# Setup
1. `cd frontend` - Go to the frontend folder
2. `yarn install` - Install the dependencies
3. `yarn dev` - Start the development server (http://localhost:3000)
4. `cd ../backend` - Go to the backend folder
5. `yarn install` - Install the dependencies
6. `yarn migrate` - Run the knex db migrations
7. `yarn dev` - Start the development server (http://localhost:3001)

# Design
1. [MUI](https://mui.com/) is installed and used for the design of the frontend.
