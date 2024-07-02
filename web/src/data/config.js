
export const localhost = window.location.hostname.includes('localhost');
const localUrl = 'http://localhost:3000/';
// export const serverUrl = 'https://emogon-admin.rungra888.com/'
export const serverUrl = 'https://app.enerq.ch/'
const preUrl = localhost?localUrl:serverUrl;
export const apiUrl = serverUrl;

export const htmlEditorKey = "iine2xgymzj2z3u9crwbkd7ggbq7gu6dvz19dedaud379fxi";  // y7gnmtbsaxnjbgh3405ioqbdm24eit5f0ovek49w8yvq5r9q

export const googleMapAPIKey = 'AIzaSyAJe9-kTKKxzb4BJi1VMR94Xy8eh_6bi-M';

export const localLoginTokenKey = 'localEnerqLoginTokenKey';

export const localEmail = 'localEnerqEmail';
export const localPassd = 'localEnerqPassd';
export const localLoginType = 'localEnerqLoginType';