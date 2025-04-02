# ImageSearchEngine_with_Chatbot
Install Dependencies for Dackend:
Goto your file path and open CMD.

npm install express mongoose cors bcryptjs jsonwebtoken

Run above one in your cmd.
And run server.js file.

To see authentication data stored in Mongodb:
First register and login.
Open cmd through file path.
Type "mongosh".
Type "use user-login".
Type "show collections" (optional).
Type "db.collection_name.find()".
And your authentication data will display.

Note : By default password is hashed and salted using bcrypt for good security practice 
