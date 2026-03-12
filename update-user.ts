import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const db = new Database('blog.db');
const defaultPassword = bcrypt.hashSync('sanniva123', 10);
db.prepare('UPDATE users SET email = ?, password = ? WHERE id = 1').run('sannivachatterjee25@gmail.com', defaultPassword);
console.log('User updated');
