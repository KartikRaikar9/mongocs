export default function handler(req, res) {
  res.status(200).setHeader('Content-Type', 'text/html').sendFile('public/login.html');
}
