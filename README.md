# GreenBoard
## To Clone the repo and start the project
1. git clone https://github.com/michaelehab/GreenBoard.git
2. cd server
3. npm install

## To Start Working on a new feature
1. git checkout main
2. git pull origin main
3. git checkout -b {Branch_Name}
4. Do the work required in this branch
5. npm test {Test_File_Name}
6. cd .. (in case you were in server folder)
7. git add .
8. git commit -m "{Your_Commit_Message}"
9. git push origin {Branch_Name}
10. It's time to make a pull request to merge your changes to the main branch
11. Open github, select the branch, click compare & pull request.
12. Write anything that can help the one reviewing your pull request.
