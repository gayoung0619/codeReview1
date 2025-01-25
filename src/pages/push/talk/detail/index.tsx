import { Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { getPushInfo, PushFormData } from "../../../../api/push";
import DOMPurify from "dompurify";

const PushDetailPage = () => {
  const { id } = useParams();

  const { data: pushInfo } = useQuery({
    queryKey: ["pushInfo", id],
    queryFn: () => getPushInfo(Number(id)),
    enabled: !!id,
  });

  const [pushData, setPushData] = useState<PushFormData>({
    // 어떤 데이터가 들어올지 모르겠어요. 일단 더미로 넣을게여!!
    template_preview: "",
  });

  useEffect(() => {
    if (pushInfo?.data) {
      setPushData({ ...pushInfo?.data });
    }
  }, [pushInfo]);

  return (
    <>
      <Wrapper>
        <h2>푸쉬관리</h2>

        <BoxWrapper>
          <div>
            <p>미리보기</p>
            <BoxContent>
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    (pushData.template_preview || "-").replace(/\n/g, "<br />")
                  ),
                }}
              />
            </BoxContent>
          </div>
        </BoxWrapper>

        <ButtonWrapper>
          <Link to="/push/talk">
            <Button variant="contained">뒤로가기</Button>
          </Link>
        </ButtonWrapper>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  padding: 30px;
  margin: 20px;
  background-color: #ffffff;
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

const BoxContent = styled.div`
  border: 1px solid #333333;
  padding: 24px;
  border-radius: 8px;
  margin-top: 20px;
`;
export default PushDetailPage;
