import {Button, TextField} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled  from "styled-components";
import {getUserInfo, patchUser, UserFormData} from "../../../api/user";
import { useEffect, useState } from "react";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: userInfo } = useQuery({
    queryKey: ["userInfo"],
    queryFn: () => getUserInfo(id as string),
  });

  const [userData, setUserData] = useState<UserFormData>({
    loginId: "",
    name: "",
    password: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    business_number: "",
    industry: "",
    worker_number: "",
  });


  useEffect(() => {
    if(userInfo?.data){
      setUserData({ ...userInfo?.data });
    }
  }, [userInfo]);

  const { mutate: updateMutation } = useMutation({
    mutationFn: (form: UserFormData) => patchUser(Number(id), form),
    onSuccess: () => {
      alert("수정되었습니다.");
      navigate(-1);
    },
    onError: () => {
      alert("수정에 실패했습니다.")
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onUpdate = () => {
    updateMutation(userData);
  };

  return (
    <>
      <Wrapper>
        <h2>회원 상세보기</h2>

        <BoxWrapper>
          <div>
            <p>아이디</p>
            <TextField
                type="text"
                id="standard-basic"
                name="loginId"
                fullWidth
                value={userData.loginId}
                onChange={handleInputChange}
                placeholder={"아이디를 입력해주세요"}
            />
          </div>

          <div>
            <p>이름</p>
            <TextField
                type="text"
                id="standard-basic"
                name="name"
                fullWidth
                value={userData.name}
                onChange={handleInputChange}
                placeholder={"이름을 입력해주세요"}
            />
          </div>

          <div>
            <p>이메일</p>
            <TextField
                type="text"
                id="standard-basic"
                name="email"
                fullWidth
                value={userData.email}
                onChange={handleInputChange}
                placeholder={"이메일을 입력해주세요"}
            />
          </div>

          <div>
            <p>연락처</p>
            <TextField
                type="text"
                id="standard-basic"
                name="phone"
                fullWidth
                value={userData.phone}
                onChange={handleInputChange}
                placeholder={"연락처를 입력해주세요"}
            />
          </div>


          {/* 여기부턴 사업자 회원만 보이기 */}
          {userInfo?.data.category === 1 && (
              <>

                <div>
                  <p>회사명</p>
                  <TextField
                      type="text"
                      id="standard-basic"
                      name="company"
                      fullWidth
                      value={userData.company}
                      onChange={handleInputChange}
                      placeholder={"회사명을 입력해주세요"}
                  />
                </div>

                <div>
                  <p>직위</p>
                  <TextField
                      type="text"
                      id="standard-basic"
                      name="position"
                      fullWidth
                      value={userData.position}
                      onChange={handleInputChange}
                      placeholder={"직위를 입력해주세요"}
                  />
                </div>

                <div>
                  <p>사업자번호</p>
                  <TextField
                      type="text"
                      id="standard-basic"
                      name="business_number"
                      fullWidth
                      value={userData.business_number}
                      onChange={handleInputChange}
                      placeholder={"사업자번호를 입력해주세요"}
                  />
                </div>

                <div>
                  <p>업종</p>
                  <TextField
                      type="text"
                      id="standard-basic"
                      name="industry"
                      fullWidth
                      value={userData.industry}
                      onChange={handleInputChange}
                      placeholder={"업종을 입력해주세요"}
                  />
                </div>

                <div>
                  <p>상시근로자 수</p>
                  <TextField
                      type="text"
                      id="standard-basic"
                      name="worker_number"
                      fullWidth
                      value={userData.worker_number}
                      onChange={handleInputChange}
                      placeholder={"상시근로자 수를 입력해주세요"}
                  />
                </div>
              </>

          )}
        </BoxWrapper>

        <ButtonWrapper>
          <Button variant="contained" onClick={onUpdate}>
            수정하기
          </Button>
          <Link to="/user">
            <Button variant="contained" color="inherit">
              뒤로가기
            </Button>
          </Link>
        </ButtonWrapper>
      </Wrapper>
    </>
  );
};

export default UserDetail;

const Wrapper = styled.div`
    padding: 30px;
    margin: 20px;
    background-color: #FFFFFF;
`;

const BoxWrapper = styled.div`
    margin-top: 40px;

    > div {
        width: 100%;
        margin-top: 10px;

        > p {
            font-size: 18px;
            color: #909090;
            font-weight: 600;
            margin-bottom: 8px;
        }

        > div {
            margin-bottom: 10px;
        }
    }
`;

const ButtonWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 40px;
    width: 100%;
`;