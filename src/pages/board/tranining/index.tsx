import {
  Box,
  Button,
  Pagination,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteTraining, getTrainingList } from "../../../api/board";

const TrainingPage = () => {
  const params = useLocation();
  const navigate = useNavigate();
  // const [value, setValue] = useState<number>(0);
  const [category, setCategory] = useState<number>(
    params.search.includes("2") ? 2 : 1
  );

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    console.log(newValue);
    // setValue(newValue);
    setCategory(newValue === 0 ? 1 : 2);
  };

  console.log(category);

  const tableColumns = [
    "No",
    "제목",
    "클릭 링크",
    "등록 일자",
    "상세보기",
    "게시물삭제",
  ];

  const [pageInfo, setPageInfo] = useState({
    page: 1,
    total: null,
  });

  const [keyword, setKeyword] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const onSearch = () => {
    setKeyword(searchKeyword);
    setPageInfo((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  const {
    data: trainingList,
    refetch: refetchTraining,
    isSuccess,
  } = useQuery({
    queryKey: ["trainingList", pageInfo.page, category, keyword],
    queryFn: () => getTrainingList(pageInfo.page, category, keyword),
  });

  const { mutate: deleteTrainingMutation } = useMutation({
    mutationFn: ({
      id,
      delete_status,
    }: {
      id: number;
      delete_status: boolean;
    }) => deleteTraining(id, { delete_status }),
    onSuccess: () => {
      alert("게시물삭제에 성공했습니다.");
      refetchTraining();
    },
    onError: () => {
      alert("게시물삭제에 실패했습니다.");
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setPageInfo({
        ...pageInfo,
        //@ts-ignore
        page: trainingList.nowPage || 1,
        //@ts-ignore
        total: trainingList.totalPage,
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    refetchTraining();
  }, [pageInfo]);

  const onChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPageInfo({ ...pageInfo, page: value });
  };

  const onWithdraw = (item: any) => {
    const isConfirmed = window.confirm("게시물을 삭제하시겠습니까?");
    if (isConfirmed) {
      deleteTrainingMutation({ id: item.id, delete_status: true });
    }
  };

  return (
    <>
      <Wrapper>
        <h2>디지털훈련/트레이닝관리</h2>

        <Box
          mt={5}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Button
              variant="contained"
              sx={{ height: "56px" }}
              onClick={() => navigate(`/board/training/create`)}
            >
              등록하기
            </Button>
          </Box>

          <Box>
            <TextField
              required
              rows={1}
              name={"searchKeyword"}
              value={searchKeyword || ""}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="제목+내용을 검색하세요"
              sx={{ margin: "0 10px" }}
            />
            <Button
              variant="contained"
              sx={{ height: "56px", width: "80px" }}
              onClick={onSearch}
            >
              검색
            </Button>
          </Box>
        </Box>

        <Box
          sx={{ borderBottom: 1, borderColor: "divider", marginTop: "20px" }}
        >
          <Tabs value={category} onChange={handleChange}>
            <Tab label="디지털훈련" value={1} onClick={() => setCategory(1)} />
            <Tab
              label="디지털트레이닝"
              value={2}
              onClick={() => setCategory(2)}
            />
          </Tabs>
        </Box>

        <div>
          <TableContainer component={Paper}>
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
                {!trainingList?.data.length ? (
                  <TableRow>
                    <TableCell colSpan={tableColumns.length} align="center">
                      데이터가 없습니다
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {trainingList?.data.map((item: any, idx: number) => (
                      <TableRow key={item.id}>
                        <TableCell align="center">{idx + 1}</TableCell>
                        <TableCell align="center">{item.title}</TableCell>
                        <TableCell align="center">{item.url}</TableCell>
                        <TableCell align="center">
                          {dayjs(item.createdAt).format("YYYY-MM-DD") || "-"}
                        </TableCell>

                        <TableCell align="center">
                          <Link to={`/board/training/${item.id}`}>
                            <Button variant="contained" color="primary">
                              상세보기
                            </Button>
                          </Link>
                        </TableCell>

                        <TableCell align="center">
                          <Button
                            variant="contained"
                            disabled={item.delete_status === true}
                            color="error"
                            onClick={() => onWithdraw(item)}
                          >
                            삭제
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {!!trainingList?.data && (
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

export default TrainingPage;
