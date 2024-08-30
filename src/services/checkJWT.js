import { useNavigate } from "react-router-dom";

export function checkJWT(api, method, request) {
  let headers = new Headers({
    "Content-Type": "application/json",
  });

  const token = localStorage.getItem("token"); // JWT 토큰 가져오기

  if (token && token !== null) {
    headers.append("Authorization", "Bearer " + token);
  }

  let options = {
    headers: headers,
    url: api,
    method: method,
  };

  //조회는 요청 data가 없음, 입력과 수정 시에는 보내는 data 있음
  if (request) {
    // GET method
    options.body = JSON.stringify(request);
  }

  return fetch(options.url, options)
    .then((response) =>
      response.json().then((json) => {
        console.log(json);
        if (!response.ok) {
          // response.ok가 true이면 정상적인 리스폰스를 받은것, 아니면 에러 리스폰스를 받은것.
          return Promise.reject(json);
        }
        return json;
      })
    )
    .catch((error) => {
      // 추가된 부분
      console.log(error.status);
      if (error.status === undefined || error.status === 403) {
        window.location.href = "/Login"; // redirect
        console.log(error);
      }
      return Promise.reject(error);
    });
}

export function homeCheckJWT(api, method, request) {
  let headers = new Headers({
    "Content-Type": "application/json",
  });

  const token = localStorage.getItem("token"); // JWT 토큰 가져오기

  if (token && token !== null) {
    headers.append("Authorization", "Bearer " + token);
  }

  let options = {
    headers: headers,
    url: api,
    method: method,
  };

  //조회는 요청 data가 없음, 입력과 수정 시에는 보내는 data 있음
  if (request) {
    // GET method
    options.body = JSON.stringify(request);
  }

  return fetch(options.url, options)
    .then((response) =>
      response.json().then((json) => {
        console.log(json);
        if (!response.ok) {
          // response.ok가 true이면 정상적인 리스폰스를 받은것, 아니면 에러 리스폰스를 받은것.
          return Promise.reject(json);
        }
        return json;
      })
    )
    .catch((error) => {
      // 추가된 부분
      console.log(error.status);
      if (error.status === undefined || error.status === 403) {
        console.log(error);
      }
      return Promise.reject(error);
    });
}
