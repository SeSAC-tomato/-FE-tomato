import api from "@/utils/api/axios";

const AUTH_API_PATH = "/auth";

export const Login = async (
  email: string,
  password: string
): Promise<string> => {
  const res = await api.post(
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
  return await api
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
  return await api
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
  await api
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

export const refreshToken = async () => {
  const res = await api.put(`${AUTH_API_PATH}/refresh`, {}, {
    withCredentials: true
  });
  console.log(res);
  
  return res;
};
