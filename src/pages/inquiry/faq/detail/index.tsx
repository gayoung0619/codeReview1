import {Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import styled from "styled-components";
import {FaqFormData, getFaqInfo, patchFaq} from "../../../../api/inquiry";

const FaqDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate()

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFaqData({
      ...faqData,
      [name]: value,
    });
  };

  const { data: faqInfo } = useQuery({
    queryKey: ["faqInfo", id],
    queryFn: () => getFaqInfo(Number(id)),
    enabled: !!id,
  });

  const [faqData, setFaqData] = useState<FaqFormData>({
    category: 0,
    question: "",
    answer: ""
  });

  useEffect(() => {
    if(faqInfo?.data){
      setFaqData({ ...faqInfo?.data});
    }
  }, [faqInfo]);

  const { mutate: patchMutation } = useMutation({
    mutationFn: (form: any) => patchFaq(id as string, form),
    onSuccess: () => {
      alert("수정되었습니다.");
      navigate(`/inquiry/faq/`)
    },
    onError: () => {
      alert("수정에 실패했습니다.");
    },
  });

  const onEdit = () => {
    patchMutation(faqData)
  }
  return (
      <>
        <Wrapper>
          <h2>FAQ관리</h2>

          <BoxWrapper>
            <div>
              <p>제목</p>
              <TextField
                  type="text"
                  id="standard-basic"
                  name="question"
                  fullWidth
                  value={faqData.question}
                  onChange={handleChange}
                  placeholder={"제목을 입략하세요"}
              />
            </div>
            <FormControl fullWidth>
              <InputLabel id="category-label">구분</InputLabel>
              <Select
                  labelId="category-label"
                  id="category-select"
                  name="category"
                  value={faqData.category}
                  onChange={handleChange}
                  label="구분"
              >
                <MenuItem value={1}>시설 및 장비대여</MenuItem>
                <MenuItem value={2}>디지털 훈련</MenuItem>
                <MenuItem value={3}>기타문의</MenuItem>
              </Select>
            </FormControl>
            <div>
              <p>답변</p>
              <TextField
                  multiline
                  rows={2}
                  id="standard-basic"
                  name="answer"
                  fullWidth
                  value={faqData.answer}
                  onChange={handleChange}
                  placeholder={"답변을 입략하세요"}
              />
            </div>
          </BoxWrapper>

          <ButtonWrapper>
            <Button variant="contained" onClick={onEdit}>수정하기</Button>
            <Link to="/inquiry/faq">
              <Button variant="contained">뒤로가기</Button>
            </Link>
          </ButtonWrapper>
        </Wrapper>
      </>
  )
}

export default FaqDetailPage

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