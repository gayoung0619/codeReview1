import styled from "styled-components";
import {Button, TextField} from "@mui/material";
import {Link, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {getInquiryInfo, InquiryFormData,} from "../../../../api/inquiry";
import {useEffect, useState} from "react";
import {inquiryCategoryMap} from "../../../../utils/inquiryStatus.ts";
import {inquirystatusMap} from "../../../../utils/reserveStatus.ts";

const InquiryDetailPage = () => {
  const { id } = useParams();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setInquiryData({
      ...inquiryData,
      [name]: value,
    });
  };

  const { data: inquiryInfo } = useQuery({
    queryKey: ["inquiryInfo", id],
    queryFn: () => getInquiryInfo(Number(id)),
    enabled: !!id,
  });

  const [inquiryData, setInquiryData] = useState<InquiryFormData>({
    title: "",
    details: "",
    category: "",
    name: "",
    phone: "",
    email: "",
    status: "",
    answer: ""
  });

  useEffect(() => {
    if(inquiryInfo?.data){
      setInquiryData({ ...inquiryInfo?.data});
    }
  }, [inquiryInfo]);
  return (
      <>
        <Wrapper>
          <h2>1:1문의관리</h2>

          <BoxWrapper>
            <div>
              <p>제목</p>
              <TextField
                  type="text"
                  id="standard-basic"
                  variant="standard"
                  name="title"
                  fullWidth
                  disabled
                  value={inquiryData.title}
                  onChange={handleChange}
              />
            </div>

            <div>
              <p>구분</p>
              <TextField
                  type="text"
                  id="standard-basic"
                  variant="standard"
                  name="category"
                  fullWidth
                  disabled
                  value={inquiryCategoryMap[inquiryData.category as string] || "-"}
                  onChange={handleChange}
              />
            </div>

            <div>
              <p>성함</p>
              <TextField
                  type="text"
                  id="standard-basic"
                  variant="standard"
                  name="name"
                  fullWidth
                  disabled
                  value={inquiryData.name}
                  onChange={handleChange}
              />
            </div>

            <div>
              <p>연락처</p>
              <TextField
                  type="text"
                  id="standard-basic"
                  variant="standard"
                  name="phone"
                  fullWidth
                  disabled
                  value={inquiryData.phone}
                  onChange={handleChange}
              />
            </div>

            <div>
              <p>이메일</p>
              <TextField
                  type="text"
                  id="standard-basic"
                  variant="standard"
                  name="email"
                  fullWidth
                  disabled
                  value={inquiryData.email}
                  onChange={handleChange}
              />
            </div>

            <div>
              <p>답변상태</p>
              <TextField
                  type="text"
                  id="standard-basic"
                  variant="standard"
                  name="status"
                  fullWidth
                  disabled
                  value={inquirystatusMap[inquiryData.status as string] || "-"}
                  onChange={handleChange}
              />
            </div>


            <div>
              <p>문의 내용</p>
              <TextField
                  id="standard-basic"
                  name="answer"
                  variant="standard"
                  fullWidth
                  disabled
                  value={inquiryData.answer}
                  onChange={handleChange}
              />
            </div>
          </BoxWrapper>

          <ButtonWrapper>
            <Link to="/inquiry/inquiry">
              <Button variant="contained">목록가기</Button>
            </Link>
          </ButtonWrapper>
        </Wrapper>
      </>
  )
}

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
            color: #121828;
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

export default InquiryDetailPage
