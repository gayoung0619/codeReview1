import {
  Button,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { getPushList } from "../../../api/push";

const PushPage = () => {
  const navigate = useNavigate();
  const handleRowClick = (id: string) => {
    navigate(`/push/talk/${id}`);
  };
  const tableColumns = ["No", "발송분류", "메시지명", "미리보기"];
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    total: null,
  });

  const {
    data: pushList,
    refetch: refetchPush,
    isSuccess,
  } = useQuery({
    queryKey: ["pushList", pageInfo.page],
    queryFn: () => getPushList(pageInfo.page),
  });

  useEffect(() => {
    if (isSuccess) {
      // 페이지 정보 업데이트
      setPageInfo({
        //@ts-ignore
        page: pushList.nowPage || 1,
        //@ts-ignore
        total: pushList.totalPage || 1,
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    refetchPush();
  }, [pageInfo]);

  const onChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPageInfo({ ...pageInfo, page: value });
  };
  return (
    <>
      <Wrapper>
        <h2>푸쉬관리</h2>
        <div>
          <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  {tableColumns.map((column) => (
                    <TableCell align="center" key={column}>
                      {column}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {!pushList?.data.length ? (
                  <TableRow>
                    <TableCell colSpan={tableColumns.length} align="center">
                      데이터가 없습니다
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {pushList?.data.map((item: any, idx: number) => (
                      <TableRow key={item.id} style={{ cursor: "pointer" }}>
                        <TableCell align="center">{idx + 1}</TableCell>
                        <TableCell align="center">
                          {item.category || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {item.user_template_subject || "-"}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            onClick={() =>
                              handleRowClick(item.user_template_no)
                            }
                          >
                            상세보기
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {!!pushList?.data && (
            <Stack spacing={2} mt={4} alignItems="center">
              <Pagination
                color="primary"
                page={pageInfo.page}
                count={pageInfo.total || 1}
                variant="outlined"
                onChange={onChangePage}
              />
            </Stack>
          )}
        </div>
      </Wrapper>
    </>
  );
};
const Wrapper = styled.div`
  padding: 30px;
  margin: 20px;
  background-color: #ffffff;

  > h1 {
    margin: 20px 0;
  }
`;
export default PushPage;
