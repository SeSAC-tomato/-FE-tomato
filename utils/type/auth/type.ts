interface EmailCheckResponse {
    duplication: boolean,
    message: string
}

interface NicknameCheckResponse {
    duplication: boolean,
    message: string
}

type register = {
    email: string;
    password: string;
    passwordConfirm: string;
    nickname: string;
    address: string;
}