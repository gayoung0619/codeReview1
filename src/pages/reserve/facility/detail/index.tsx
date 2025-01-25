import {Button, TextField} from "@mui/material";
import {Link, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import styled from "styled-components";
import {FacilityFormData, getFacilityInfo} from "../../../../api/reserve";
import dayjs from "dayjs";

const FacilityDetail = () => {

  const { id } = useParams();

  const { data: facilityInfo, isLoading, isError } = useQuery({
    queryKey: ["facilityInfo", id],
    queryFn: () => getFacilityInfo(Number(id)),
    enabled: !!id,
  });

  const [facilityData, setFacilityData] = useState<FacilityFormData>({
    name: "",
    company: "",
    phone: "",
    birth: "",
    email: "",
    facility: {
      name: "",
    },
    userCount: "",
    reserveDate: "",
    reservationTime: "",
    detail: "",
  });

  // 데이터를 받아오면 상태를 설정
  useEffect(() => {
    if (facilityInfo?.data && facilityInfo.data.length > 0) {
      setFacilityData(facilityInfo.data[0]);
    }
  }, [facilityInfo]);

  // 로딩 중일 때 표시
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // 에러 발생 시 표시
  if (isError) {
    return <div>Error loading facility information. Please try again later.</div>;
  }



  return (
      <>
        <Wrapper>
          <h2>시설예약 상세보기</h2>

          <BoxWrapper>
            <div>
              <p>성명</p>
              <TextField
                  type="text"
                  id="standard-basic"
                  variant="standard"
                  disabled
                  name="name"
                  fullWidth
                  value={facilityData?.name || ""}
              />
            </div>
            <div>
              <p>소속</p>
              <TextField
                  type="text"
                  id="standard-basic"
                  variant="standard"
                  disabled
                  name="company"
                  fullWidth
                  value={facilityData?.company || ""}
              />
            </div>
            <div>
              <p>연락처</p>
              <TextField
                  type="text"
                  id="standard-basic"
                  name="phone"
                  variant="standard"
                  disabled
                  fullWidth
                  value={facilityData?.phone || ""}
              />
            </div>
            <div>
              <p>생년월일</p>
              <TextField
                  type="text"
                  id="standard-basic"
                  variant="standard"
                  disabled
                  name="birth"
                  fullWidth
                  value={facilityData?.birth || ""}
              />
            </div>
            <div>
              <p>이메일</p>
              <TextField
                  type="text"
                  id="standard-basic"
                  variant="standard"
                  disabled
                  name="email"
                  fullWidth
                  value={facilityData?.email || ""}
              />
            </div>
            <div>
              <p>시설</p>
              <TextField
                  type="text"
                  id="standard-basic"
                  variant="standard"
                  disabled
                  name="facility.name"
                  fullWidth
                  value={facilityData?.facility?.name || ""}
              />
            </div>

            <div>
              <p>예약인원</p>
              <TextField
                  type="text"
                  id="standard-basic"
                  variant="standard"
                  disabled
                  name="facility.userCount"
                  fullWidth
                  value={facilityData?.userCount || ""}
              />
            </div>

            <div>
              <p>대여날짜</p>
              <TextField
                  type="text"
                  id="standard-basic"
                  variant="standard"
                  disabled
                  name="reserveDate"
                  fullWidth
                  value={dayjs(facilityData?.reserveDate).format("YYYY-MM-DD") || "-"}
              />
            </div>

            <div>
              <p>대여시간</p>
              <TextField
                  type="text"
                  id="standard-basic"
                  variant="standard"
                  disabled
                  name="reservationTime"
                  fullWidth
                  value={facilityData?.reservationTime || "-"}
              />
            </div>

            <div>
              <p>사용목적</p>
              <TextField
                  type="text"
                  id="standard-basic"
                  variant="standard"
                  disabled
                  name="detail"
                  fullWidth
                  value={facilityData?.detail || ""}
              />
            </div>
          </BoxWrapper>

          <ButtonWrapper>
            <Link to="/reserve/facility">
              <Button variant="contained">뒤로가기</Button>
            </Link>
          </ButtonWrapper>
        </Wrapper>
      </>
  )
}
export default FacilityDetail;

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