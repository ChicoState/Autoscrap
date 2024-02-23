# Autoscrap

1) Install node and npm
You can do this any way you like. If you already have these installed, make sure to update them to their latest stable versions.
Use these commands to verify installation:
npm -v
node -v

2) Bring the project up to date
Clone this git repo if you have not already
Checkout the main branch. If you have changes, you may not be able to checkout the main branch.
You can use the -f flag to delete these changes. If you want to save them, you can copy them somewhere or maybe use git stash.
git checkout -f main
do a git pull from the main branch
git pull origin main

3) install dependencies
Your package.json should now have additional dependencies, and you need to install them:
npm install
This will look into your package.json and install dependencies into a node_modules directory.
If node_modules does not exist, a new one will automatically be created

4) run the server
Use 
node index.js
to run the server. visit localhost:8080 in a browser.
