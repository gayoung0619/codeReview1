import styled from "styled-components";
import {
  Button,
  CardContent,
  Grid,
  Typography,
  TextField,
} from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authPost, UserResponse } from "../api/auth";
import { setStorage } from "../utils/storage.ts";
import { AxiosResponse } from "axios";

interface FormValues {
  loginId: string;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const { mutate: loginMutaion } = useMutation({
    mutationFn: (form: FormValues) => authPost(form),
    onSuccess: (response: AxiosResponse<UserResponse>) => {
      const { accessToken, refreshToken } = response.data;
      // console.log(accessToken, refreshToken);
      setStorage("isUser", accessToken);
      setStorage("userRefresh", refreshToken);
      navigate("/user");
    },
    onError: (err) => {
      //@ts-ignore
      alert(err.response.data.content)
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) => {
    const payload = { ...data, category: 3 }; // category: 3 추가
    loginMutaion(payload); // 변형된 데이터 전송
  };

  return (
    <Wrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography p={3} variant="h3" component="div" gutterBottom>
          Login
        </Typography>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item md={12} xs={12}>
              <TextField
                placeholder="아이디"
                fullWidth
                error={!!errors.loginId}
                helperText={errors.loginId ? errors.loginId.message : null}
                {...register("loginId", {
                  required: "아이디는 필수 항목입니다.",
                })}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                placeholder="패스워드"
                type="password"
                fullWidth
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : null}
                {...register("password", {
                  required: "비밀번호는 필수 항목입니다.",
                })}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <Button
                type={"submit"}
                fullWidth
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? "로그인 중..." : "로그인"}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 20px;
  background: #fff;
  max-width: 500px;
  margin: 150px auto 0;
`;

export default LoginPage;
