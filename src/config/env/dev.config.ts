export default () => ({
  PORT: process.env.PORT,
  db: {
    url: process.env.DB_URL,
  },
  access: {
    jwt_secret: process.env.JWT_SECRET,
    googleClintID: process.env.GOOGLE_CLIENT_ID,
    googleClintSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
});