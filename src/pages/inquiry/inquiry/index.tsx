import styled from "styled-components";
import {
  Box,
  Button, FormControl, InputLabel, MenuItem, Pagination,
  Paper, Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, TextField
} from "@mui/material";
import {inquiryCategoryMap} from "../../../utils/inquiryStatus.ts";
import dayjs from "dayjs";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useMutation, useQuery} from "@tanstack/react-query";
import {getInquiryList, patchInquiryStatus} from "../../../api/inquiry";
import {inquirystatusMap} from "../../../utils/reserveStatus.ts";

const InquiryPage = () => {
  const navigate = useNavigate();
  const [updateStatus, setUpdateStatus] = useState<Record<string, string>>({});
  const handleRowClick = (id: string) => {
    navigate(`/inquiry/inquiry/detail/${id}`);
  };
  const tableColumns = ["No", "구분", "성함", "이메일","연락처", "등록일자", "답변상태", "상세보기"];
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    total: null,
  });


  const [category, setCategory] = useState<string>("");
  const [keyword, setKeyword] = useState<string>("");
  const [searchCategory, setSearchCategory] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const onSearch = () => {
    setCategory(searchCategory); // 선택된 카테고리
    setKeyword(searchKeyword); // 입력된 검색어
    setPageInfo((prev) => ({
      ...prev,
      page: 1, // 첫 페이지로 초기화
    }));
  };

  const {
    data: inquiryList,
    refetch: refetchInquiry,
    isSuccess,
  } = useQuery({
    queryKey: ["inquiryList", pageInfo.page, category, keyword],
    queryFn: () => getInquiryList(pageInfo.page, category, keyword),
  });

  useEffect(() => {
    if(isSuccess && inquiryList) {
      // 페이지 정보 업데이트
      setPageInfo({
        //@ts-ignore
        page: inquiryList.nowPage || 1,
        //@ts-ignore
        total: inquiryList.totalPage || 1,
      });

      // 상태 초기값 설정
      const initialStatuses = inquiryList.data.reduce((acc: Record<string, string>, item: any) => {
        acc[item.id] = item.status.toString(); // id를 키로, status를 값으로 저장
        return acc;
      }, {});

      setUpdateStatus(initialStatuses);
    }
  }, [isSuccess, inquiryList]);

  useEffect(() => {
    refetchInquiry();
  }, [pageInfo]);

  const onChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPageInfo({ ...pageInfo, page: value });
  };

  const { mutate: patchStatusMutation } = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
        patchInquiryStatus(id, status),
    onSuccess: () => {
      refetchInquiry();
      alert("상태가 변경되었습니다.");
    },
    onError: () => {
      alert("주문상태변경에 실패되었습니다.");
    },
  });

  const handleStatusChange = (id: number, status: string) => {
    setUpdateStatus((prevStatus) => ({
      ...prevStatus,
      [id]: status,
    }));
    patchStatusMutation({
      id: id,
      status: status,
    });
  };

  return (
      <>
        <Wrapper>
          <h2>1:1문의관리</h2>

          <Box mt={3} sx={{display: "flex", justifyContent: "flex-end"}}>
            <FormControl>
              <InputLabel id="cateLabel">
                검색
              </InputLabel>
              <Select
                  labelId="cateLabel"
                  id="cateLabel"
                  value={searchCategory || "1"}
                  label="제목"
                  name="searchCategory"
                  onChange={(e) => setSearchCategory(e.target.value)}
                  sx={{ minWidth: "100px" }}
              >
                <MenuItem value={"1"}>성함</MenuItem>
                <MenuItem value={"2"}>구분</MenuItem>
              </Select>
            </FormControl>
            {(searchCategory === "1" || !searchCategory) && (
                <TextField
                    required
                    rows={1}
                    name={"searchKeyword"}
                    value={searchKeyword || ""}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="검색어를 입력해주세요"
                    sx={{margin: "0 10px"}}
                />
            )}

            {searchCategory === "2" && (
                <FormControl>
                  <InputLabel id="keywordLabel">
                    구분선택
                  </InputLabel>
                  <Select
                      labelId="keywordLabel"
                      id="keywordLabel"
                      value={searchKeyword}
                      label="제목"
                      name="searchKeyword"
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      sx={{ minWidth: "205px", margin: "0 10px" }}
                  >
                    <MenuItem value={"1"}>이용문의</MenuItem>
                    <MenuItem value={"2"}>교육문의</MenuItem>
                    <MenuItem value={"3"}>기타문의</MenuItem>
                  </Select>
                </FormControl>
            )}

            <Button
                variant="contained"
                sx={{height: "56px", width: "80px"}}
                onClick={onSearch}
            >
              검색
            </Button>
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
                  {!inquiryList?.data.length ? (
                      <TableRow>
                        <TableCell colSpan={tableColumns.length} align="center">
                          데이터가 없습니다
                        </TableCell>
                      </TableRow>
                  ) : (
                      <>
                        {inquiryList?.data.map((item: any, idx: number) => (
                            <TableRow key={item.id} style={{cursor: "pointer"}}>
                              <TableCell align="center">{idx + 1}</TableCell>
                              <TableCell align="center">
                                {inquiryCategoryMap[item.category] || "기타"}
                              </TableCell>
                              <TableCell align="center">{item.name}</TableCell>
                              <TableCell align="center">{item.email}</TableCell>
                              <TableCell align="center">{item.phone}</TableCell>
                              <TableCell align="center">{dayjs(item.createdAt).format("YYYY-MM-DD")}</TableCell>
                              <TableCell align="center">

                                <FormControl sx={{m: 1, minWidth: 120}}>
                                  <InputLabel id="status">상태</InputLabel>
                                  <Select
                                      labelId="status"
                                      id="status"
                                      label="상태"
                                      value={updateStatus[item.id] || ""}
                                      onChange={(e) =>
                                          handleStatusChange(
                                              item.id,
                                              e.target.value,
                                          )
                                      }
                                  >
                                    {Object.entries(inquirystatusMap).map(([key, value]) => (
                                        <MenuItem key={key} value={key}>
                                          {value}
                                        </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </TableCell>
                              <TableCell align="center">
                                <Button variant="contained" onClick={() => handleRowClick(item.id)}>
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
            {!!inquiryList?.data && (
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
export default InquiryPage