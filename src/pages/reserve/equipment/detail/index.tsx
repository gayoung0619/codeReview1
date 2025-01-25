import {Button, TextField} from "@mui/material";
import dayjs from "dayjs";
import {Link, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {EquipmentFormData, getEquipmentInfo} from "../../../../api/reserve";
import {useEffect, useState} from "react";
import styled from "styled-components";

const EquipmentDetail = () => {
  const { id } = useParams();

  const { data: equipmentInfo } = useQuery({
    queryKey: ["equipmentInfo"],
    queryFn: () => getEquipmentInfo(Number(id)),
  });

  const [equipmentData, setEquipmentData] = useState<EquipmentFormData>({
    name: "",
    company: "",
    phone: "",
    birth: "",
    email: "",
    equipment: {
      name: ""
    },
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    count: 0,
    detail: "",
  });

  useEffect(() => {
    if(equipmentInfo?.data){
      setEquipmentData({ ...equipmentInfo?.data });
    }
  }, [equipmentInfo]);



  return (
      <>
        <Wrapper>
          <h2>장비예약 상세보기</h2>
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
                  value={equipmentData.name}
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
                  value={equipmentData.company}
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
                  value={equipmentData.phone}
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
                  value={equipmentData.birth}
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
                  value={equipmentData.email}
              />
            </div>

            <div>
              <p>대여 장비</p>
              <TextField
                  type="text"
                  id="standard-basic"
                  variant="standard"
                  disabled
                  name="equipment.name"
                  fullWidth
                  value={equipmentData.equipment.name}
              />
            </div>

            <div>
              <p>개수</p>
              <TextField
                  type="text"
                  id="standard-basic"
                  variant="standard"
                  disabled
                  name="count"
                  fullWidth
                  value={equipmentData.count}
              />
            </div>

            <div>
              <p>대여일</p>
              <TextField
                  type="text"
                  id="standard-basic"
                  variant="standard"
                  disabled
                  name="startDate"
                  fullWidth
                  value={dayjs(equipmentData.startDate).format("YYYY-MM-DD")}
              />
            </div>

            <div>
              <p>대여시간</p>
              <TextField
                  type="text"
                  id="standard-basic"
                  variant="standard"
                  disabled
                  name="startTime"
                  fullWidth
                  value={equipmentData.startTime}
              />
            </div>

            <div>
              <p>반납일</p>
              <TextField
                  type="text"
                  id="standard-basic"
                  variant="standard"
                  disabled
                  name="endDate"
                  fullWidth
                  value={dayjs(equipmentData.endDate).format("YYYY-MM-DD")}
              />
            </div>

            <div>
              <p>반납시간</p>
              <TextField
                  type="text"
                  id="standard-basic"
                  variant="standard"
                  disabled
                  name="endTime"
                  fullWidth
                  value={equipmentData.endTime}
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
                  value={equipmentData.detail}
              />
            </div>
          </BoxWrapper>

          <ButtonWrapper>
            <Link to="/reserve/equipment">
              <Button variant="contained">뒤로가기</Button>
            </Link>
          </ButtonWrapper>
        </Wrapper>
      </>
  )
}
export default EquipmentDetail

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