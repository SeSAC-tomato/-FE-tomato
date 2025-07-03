import axios from "axios";

export const Login = async (
  email: string,
  password: string
): Promise<string> => {
  const res = await axios.post(
    `http://localhost:8080/api/v1/auth/login`,
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
    return await axios.get(`http://localhost:8080/api/v1/auth/email?email=${email}`)
    .then((res): CommonResponse<EmailCheckResponse> => {
      console.log(res.data);
      
        return res.data
    }).catch(e => {
      throw new Error("");
});
}