import axios from "axios";

const AUTH_API_PATH = "http://localhost:8080/api/v1/auth";

export const Login = async (
  email: string,
  password: string
): Promise<string> => {
  const res = await axios.post(
    `${AUTH_API_PATH}/login`,
    {
      email: email,
      password: password,
    },
    {
      withCredentials: true,
    }
  );
  console.log(res.headers);

  const accessToken = res.headers["authorization"];
  console.log(accessToken);
  if (!accessToken) {
    throw new Error("액세스 토큰이 없습니다.");
  }
  return accessToken;
};

export const checkEmailDuplicate = async (
  email: string
): Promise<CommonResponse<EmailCheckResponse>> => {
  return await axios
    .get(`${AUTH_API_PATH}/email?email=${email}`)
    .then((res): CommonResponse<EmailCheckResponse> => {
      console.log(res.data);

      return res.data;
    })
    .catch((e) => {
      throw new Error(e);
    });
};

export const checkNicknameDuplicate = async (
  nickname: string
): Promise<CommonResponse<NicknameCheckResponse>> => {
  return await axios
    .get(`${AUTH_API_PATH}/nickname?nickname=${nickname}`)
    .then((res): CommonResponse<NicknameCheckResponse> => {
      console.log(res.data);

      return res.data;
    })
    .catch((e) => {
      throw new Error(e);
    });
};

export const register = async (register: register): Promise<void> => {
  await axios
    .post(`${AUTH_API_PATH}/register`, {
      email: register.email,
      password: register.password,
      passwordConfirm: register.passwordConfirm,
      nickname: register.nickname,
      address: register.address,
    })
    .catch((e) => {
      throw new Error(e);
    });
};
