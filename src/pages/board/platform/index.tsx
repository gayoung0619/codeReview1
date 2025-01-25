import {
  Box,
  Button,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, TextField
} from "@mui/material";
import dayjs from "dayjs";
import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import {deletePlatform, getPlatformList} from "../../../api/board";

const PlatformPage = () => {
  const navigate = useNavigate();
  const handleRowClick = (id: string) => {
    navigate(`/board/platform/${id}`);
  };
  const tableColumns = ["No", "제목", "등록일자", "상세보기", "삭제"];
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    total: null,
  });

  const [keyword, setKeyword] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const onSearch = () => {
    setKeyword(searchKeyword); // 입력된 검색어
    setPageInfo((prev) => ({
      ...prev,
      page: 1, // 첫 페이지로 초기화
    }));
  };

  const {
    data: platformList,
    refetch: refetchPlatform,
    isSuccess,
  } = useQuery({
    queryKey: ["NoticeList", pageInfo.page, keyword],
    queryFn: () => getPlatformList(pageInfo.page, keyword),
  });

  const { mutate: deletePlatformMutation } = useMutation({
    mutationFn: ({ id, delete_status }: { id: number; delete_status: boolean }) =>
        deletePlatform(id, { delete_status }),
    onSuccess: () => {
      alert("삭제했습니다.");
      refetchPlatform();
    },
    onError: () => {
      alert("삭제에 실패했습니다.");
    },
  });

  const onDelete = (item: any) => {
    const isConfirmed = window.confirm("삭제하시겠습니까?");
    if (isConfirmed) {
      deletePlatformMutation({ id: item.id, delete_status: true });
    }
  };

  useEffect(() => {
    if(isSuccess) {
      // 페이지 정보 업데이트
      setPageInfo({
        //@ts-ignore
        page: platformList.nowPage || 1,
        //@ts-ignore
        total: platformList.totalPage || 1,
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    refetchPlatform();
  }, [pageInfo]);

  const onChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPageInfo({ ...pageInfo, page: value });
  };
  return (
      <>
        <Wrapper>
          <h2>플랫폼 관리</h2>

          <Box mt={5} sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <Box>
              <Button variant="contained" sx={{height: "56px"}} onClick={() => navigate(`/board/platform/create`)}>등록하기</Button>
            </Box>

            <Box>
              <TextField
                  required
                  rows={1}
                  name={"searchKeyword"}
                  value={searchKeyword || ""}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="제목을 검색하세요"
                  sx={{margin: "0 10px"}}
              />
              <Button
                  variant="contained"
                  sx={{height: "56px", width: "80px"}}
                  onClick={onSearch}
              >
                검색
              </Button>
            </Box>
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
                  {!platformList?.data ? (
                      <TableRow>
                        <TableCell colSpan={tableColumns.length} align="center">
                          데이터가 없습니다
                        </TableCell>
                      </TableRow>
                  ) : (
                      <>
                        {platformList?.data.map((item: any, idx: number) => (
                            <TableRow key={item.id} style={{cursor: "pointer"}}>
                              <TableCell align="center" width={"80px"}>{idx + 1}</TableCell>
                              <TableCell align="center">{item.title}</TableCell>
                              <TableCell align="center" width={"150px"}>{dayjs(item.createdAt).format("YYYY-MM-DD")}</TableCell>

                              <TableCell align="center" width={"150px"}>
                                <Button variant="contained" onClick={() => handleRowClick(item.id)}>상세보기</Button>
                              </TableCell>
                              <TableCell align="center" width={"150px"}>
                                <Button variant="contained" color="error" onClick={() => onDelete(item)}>삭제</Button>
                              </TableCell>
                            </TableRow>
                        ))}
                      </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {!!platformList?.data && (
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
export default PlatformPage