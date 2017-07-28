# Publisher theme The Source
- create "/contentapi.json" route and attach api.html.twig template
- create content lists named "mostRead", "editorsPicks" and "topNews"
- create menu named "mainNavigation"
- create proper image crop sizes (in superdesk vacabularies): "300x220", "1100x500", "600x360"
 
# Setting up for development
- run "npm install" in root folder and in /app folder
- run "gulp watch" in theme root folder to edit global styles as well as js for server side rendered article template
- set remote host in app/variables.js. Run "npm run dev" in /app folder. It will create a server and open your browser automatically

# Building theme and vue.js app
- run "gulp build" in theme root folder 
- reset host in app/variables.js to "". Run "npm run build" in /app folder
- run "gulp sw" to generate service worker