# Bubble
   Welcome to the source code for my social media app Bubble. There will be several things gone over in this README, please refere to the table of contents below for more details:

## Table of Contents
- Why does this exist
- The tech used
- Rules for updates

## Why does this exist
   Bubble exist for the two reasons:
   
   1. Because I wanted to learn about interacting with backend databases, usesr auth, and probably most importantly ReactJS as a whole
   2. To give the biggest middle finger possible to my High School and their new phone policies
   
## The tech used
   Under the hood Bubble uses what I will be calling the SAD tech stack. What is the SAD tech stack? Well let me explain it to you:
   
   - S: Supabase, used for both user auth and as a database
   - A: reAct, because that was the whole goal of the project, to learn react
   - D: react-router-Dom, to handle routing between different URL's
   
   Now does this name really make sense? No, not really. But in the great words of Fireship: "It's important to make that acronym pop, because it will automaticly make other people in the tech industry think you know what you're doing".
   
   If your wondering about where the site is hosted, I'm using Vercel for that, but really this tech stack and be hosted anywhere so it doesn't really matter. I just personally like Vercel.

## Rules for updates
   If you want to contribute to this website, first off that's amazing of you, thank you for the help. Even if that help is just fixing some typos on the README, I will thank anyone who helps. As for the actual rules:

   1. If the feature you're working with doesn't already have a seprate branch for the changes, please make one so that we can more easily track changes. This rule doe not apply to things like updating the Home page, but it should apply to things like changing how user profile pictures are generated
   2. When you push the update, document any huge changes like additional components in the description. If you add something like a function, denote that with a +. If you remove something, denote that with a -. And if the change is just updating something that already exists, like changing how the nav buttons look, denote that with an =.
   3. If you're working with anything that needs you to connect to Supabase on your personal machine, contact me as I am the only person who has access to the .env.local file.
   4. Keep all of your changes on their branch until I look at the changes you've made. I will merge them into the master branch for production.

That's it from me. Happy coding! Contact me with any questions/concerns you have here: therealemptylegoman@gmail.com
