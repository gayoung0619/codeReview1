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
  TableRow
} from "@mui/material";
import dayjs from "dayjs";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useMutation, useQuery} from "@tanstack/react-query";
import {deleteBanner, getBannerList} from "../../api/banner";
import styled from "styled-components";

const BannerPage = () => {
  const navigate = useNavigate();
  // const [toggleState, setToggleState] = useState<{ [key: number]: boolean }>({});
  const handleRowClick = (id: string) => {
    navigate(`/banner/${id}`);
  };
  const tableColumns = ["No", "파일명", "이미지파일", "등록일자", "노출순서", "노출여부", "상세보기", "삭제"];
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    total: null,
  });

  const {
    data: BannerList,
    refetch: refetchBanner,
    isSuccess,
  } = useQuery({
    queryKey: ["BannerList", pageInfo.page],
    queryFn: () => getBannerList(pageInfo.page),
  });

  const { mutate: deleteBannerMutation } = useMutation({
    mutationFn: ({ id, delete_status }: { id: number; delete_status: boolean }) =>
        deleteBanner(id, { delete_status }),
    onSuccess: () => {
      alert("삭제했습니다.");
      refetchBanner();
    },
    onError: () => {
      alert("삭제에 실패했습니다.");
    },
  });

  const onDelete = (item: any) => {
    const isConfirmed = window.confirm("삭제하시겠습니까?");
    if (isConfirmed) {
      deleteBannerMutation({ id: item.id, delete_status: true });
    }
  };

  useEffect(() => {
    if(isSuccess) {
      // 페이지 정보 업데이트
      setPageInfo({
        //@ts-ignore
        page: BannerList.nowPage || 1,
        //@ts-ignore
        total: BannerList.totalPage || 1,
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    refetchBanner();
  }, [pageInfo]);

  const onChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPageInfo({ ...pageInfo, page: value });
  };

  // const handleToggle = (id: number) => {
  //   setToggleState((prevState) => ({
  //     ...prevState,
  //     [id]: !prevState[id],
  //   }));
  // };

  return (
      <>
        <Wrapper>
          <h2>배너 관리</h2>

          <Box textAlign={"right"}>
            <Button variant="contained" onClick={() => navigate(`/banner/create`)}>등록하기</Button>
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
                  {!BannerList?.data.length ? (
                      <TableRow>
                        <TableCell colSpan={tableColumns.length} align="center">
                          데이터가 없습니다
                        </TableCell>
                      </TableRow>
                  ) : (
                      <>
                        {BannerList?.data.map((item: any, idx: number) => (
                            <TableRow key={item.id} style={{cursor: "pointer"}}>
                              <TableCell align="center" width={"80px"}>{idx + 1}</TableCell>
                              <TableCell align="center">{item.file_name}</TableCell>
                              <TableCell align="center">
                                <img src={item.file_url} style={{width: "150px", margin: "0 auto" }} />
                              </TableCell>
                              <TableCell align="center" width={"150px"}>{dayjs(item.createdAt).format("YYYY-MM-DD")}</TableCell>
                              <TableCell align="center">{item.sort}</TableCell>
                              {/*<TableCell align="center">*/}
                              {/*  <Switch*/}
                              {/*      checked={toggleState[item.id] || false}*/}
                              {/*      onChange={() => handleToggle(item.id)}*/}
                              {/*      color="primary"*/}
                              {/*  />*/}
                              {/*</TableCell>*/}
                              <TableCell align="center" style={{fontWeight: 700}}>{item.status ? "노출" : "비노출"}</TableCell>
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
            {!!BannerList?.data && (
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
`;
export default BannerPage