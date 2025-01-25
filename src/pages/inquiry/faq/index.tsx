import {
  Box,
  Button,
  Pagination,
  Paper,
  Stack,
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow,
} from "@mui/material";
import dayjs from "dayjs";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useMutation, useQuery} from "@tanstack/react-query";
import styled from "styled-components";
import {deleteFaq, getFaqList} from "../../../api/inquiry";
import { faqCategoryMap } from "../../../utils/inquiryStatus.ts";

const FaqPage = () => {
  const navigate = useNavigate();
  const handleRowClick = (id: string) => {
    navigate(`/inquiry/faq/detail/${id}`);
  };
  const tableColumns = ["No", "구분", "제목", "등록일자","상세", "삭제"];
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    total: null,
  });

  const {
    data: faqList,
    refetch: refetchFaq,
    isSuccess,
  } = useQuery({
    queryKey: ["faqList", pageInfo.page],
    queryFn: () => getFaqList(pageInfo.page),
  });

  const { mutate: deleteFaqMutation } = useMutation({
    mutationFn: ({ id, delete_status }: { id: number; delete_status: boolean }) =>
        deleteFaq(id, { delete_status }),
    onSuccess: () => {
      alert("삭제했습니다.");
      refetchFaq();
    },
    onError: () => {
      alert("삭제에 실패했습니다.");
    },
  });

  const onDelete = (item: any) => {
    const isConfirmed = window.confirm("삭제하시겠습니까?");
    if (isConfirmed) {
      deleteFaqMutation({ id: item.id, delete_status: true });
    }
  };

  useEffect(() => {
    if(isSuccess) {
      // 페이지 정보 업데이트
      setPageInfo({
        //@ts-ignore
        page: faqList.nowPage || 1,
        //@ts-ignore
        total: faqList.totalPage || 1,
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    refetchFaq();
  }, [pageInfo]);

  const onChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPageInfo({ ...pageInfo, page: value });
  };
  return (
      <>
        <Wrapper>
          <h2>FAQ관리</h2>
          <Box mt={3} textAlign="right">
            <Button variant="contained" onClick={() => navigate(`/inquiry/faq/create`)}>등록</Button>
          </Box>

          <div>
            <TableContainer component={Paper} sx={{marginTop: "20px"}}>
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
                  {!faqList?.data.length ? (
                      <TableRow>
                        <TableCell colSpan={tableColumns.length} align="center">
                          데이터가 없습니다
                        </TableCell>
                      </TableRow>
                  ) : (
                      <>
                        {faqList?.data.map((item: any, idx: number) => (
                            <TableRow key={item.id} style={{cursor: "pointer"}}>
                              <TableCell align="center">{idx + 1}</TableCell>
                              <TableCell align="center">
                                {faqCategoryMap[item.category] || "기타"} {/* '기타'는 기본값으로 설정 */}
                              </TableCell>
                              <TableCell align="center">{item.question}</TableCell>
                              <TableCell align="center">{dayjs(item.createdAt).format("YYYY-MM-DD")}</TableCell>
                              <TableCell align="center">
                                <Button variant="contained" onClick={() => handleRowClick(item.id)}>상세보기</Button>
                              </TableCell>
                              <TableCell align="center">
                                <Button variant="contained" color="error" onClick={() => onDelete(item)}>삭제</Button>
                              </TableCell>
                            </TableRow>
                        ))}
                      </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {!!faqList?.data && (
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
  )
}

const Wrapper = styled.div`
    padding: 30px;
    margin: 20px;
    background-color: #FFFFFF;
    
    > h1 {
        margin: 20px 0;
    }
`;

export default FaqPage
