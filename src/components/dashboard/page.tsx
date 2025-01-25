import styled from "styled-components";

const Dashboard = () => {
  const MENU = [
    "신규주문",
    "취소관리",
    "반품관리",
    "교환관리",
    "답변대기 문의",
    "체크인",
    "체크아웃",
    "입금대기",
    "예약완료",
    "취소요청",
    "취소처리중",
    "문의",
  ];

  return (
    <BoardWrapper>
      <BoardBox>
        <TodayWrapper>
          <h2>오늘할일</h2>
          <span>5</span>
        </TodayWrapper>
        <ul>
          {MENU.map((list, idx) => (
            <li key={idx}>
              <h3>{list}</h3>
              <span>0</span>
            </li>
          ))}
        </ul>
      </BoardBox>
      <BoardBox>
        <div>
          <h2>방문자 현황</h2>
        </div>
        <ProgressWrapper>
          <h2>사이트 요약</h2>
          <li>
            <h3>
              <span>오늘 신규회원</span>
              <span>0</span>
            </h3>
          </li>
          <li>
            <h3>
              <span>오늘 신규회원</span>
              <span>0</span>
            </h3>
          </li>
          <li>
            <h3>
              <span>오늘 신규회원</span>
              <span>0</span>
            </h3>
          </li>
          <li>
            <h3>
              <span>오늘 신규회원</span>
              <span>0</span>
            </h3>
          </li>
          <li>
            <h3>
              <span>오늘 신규회원</span>
              <span>0</span>
            </h3>
          </li>
        </ProgressWrapper>
      </BoardBox>
    </BoardWrapper>
  );
};

const BoardWrapper = styled.div`
  padding: 47px 97px;
`;

const BoardBox = styled.div`
  background-color: #fff;
  box-shadow: 0 4px 4px rgba(100, 116, 139, 0.12);
  padding: 27px 36px;

  > ul {
    display: flex;
    flex-wrap: wrap;
    gap: 17px 34px;
    padding-top: 23px;

    li {
      display: flex;
      align-items: center;
      span {
        color: rgba(7, 110, 55, 1);
        font-weight: 700;
        margin-left: 6px;
      }
    }
  }

  &:nth-of-type(n + 2) {
    margin-top: 75px;
  }

  &:nth-of-type(2) {
    display: flex;
    gap: 62px;
  }
`;

const TodayWrapper = styled.div`
  display: flex;
  align-items: center;
  span {
    background: rgba(7, 110, 55, 1);
    color: #fff;
    font-weight: 700;
    padding: 4px 31px;
    border-radius: 10px;
    margin-left: 12px;
  }
`;

const ProgressWrapper = styled.ul``;
export default Dashboard;
