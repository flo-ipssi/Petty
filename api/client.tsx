
// const client = axios.create({
//     baseURL: 'http://192.168.1.14:8989',
// })
// const client =  'http://local:8989';
const client =  process.env.EXPO_PUBLIC_API_URL;

export default client;