import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev';
const token = jwt.sign({ id: 1, email: 'admin@sanniva.com' }, JWT_SECRET, { expiresIn: '1d' });

async function test() {
  const res = await fetch('http://localhost:3000/api/posts/demo', {
    method: 'POST',
    headers: {
      'Cookie': `token=${token}`
    }
  });
  const text = await res.text();
  console.log(res.status, text);
}

test();
