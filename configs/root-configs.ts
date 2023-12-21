export const RootConfigs = () => ({
  databaseURL:
    'mongodb://127.0.0.1:27017/library?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.9.1',
  hashSalt: 10,
  IP: '192.168.88.24',
  JWTSecret: 'bL7DLhJopwggaq6pEfSh5pbjoENKLdt9',
  JWTAdminSecret: 'Kgs9Js0Hsalaw9Poan81Mndla23NsaaK',
  PORT: process.env.PORT || 5000,
  adminAccessKey: 'Shoh__2020',
});
