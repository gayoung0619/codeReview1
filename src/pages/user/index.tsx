import {
  Button,
  Pagination,
  Paper,
  Stack,
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import styled  from "styled-components";
import { deleteUser, getUserList } from "../../api/user";
import { Link } from "react-router-dom";
import dayjs from 'dayjs';
import { CSVLink } from "react-csv";
import DescriptionIcon from "@mui/icons-material/Description";

const UserPage = () => {
  const [value, setValue] = useState<number>(0);
  const [category, setCategory] = useState<number>(1);
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setCategory(newValue === 0 ? 1 : 2);
  };

  const tableColumns = ["No", "성명", "아이디", "연락처", "이메일", "계정생성일", "상세보기", "회원삭제"];
  const [deleteUserId, setDeleteUserId] = useState("");
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    total: null,
  });

  const {
    data: userList,
    refetch: refetchUser,
    isSuccess,
  } = useQuery({
    queryKey: ["userList", pageInfo.page, category],
    queryFn: () => getUserList(pageInfo.page, category),
  });

  const { mutate: deleteUserMutation } = useMutation({
    mutationFn: () => deleteUser(deleteUserId),
    onSuccess: () => {
      alert("유저탈퇴에 성공했습니다.");
      refetchUser();
    },
    onError: () => {
      alert("유저탈퇴에 실패했습니다.");
    },
  });

  const csvData = userList?.data?.map((user: any) => ({
    name: user.name || "-",
    loginId: user.loginId || "-",
    phone: user.phone || "-",
    email: user.email || "-",
    createdAt: user.createdAt || "-",
    delete_status: user.delete_status
  })) || [];  // userList?.data가 undefined일 때 빈 배열로 fallback

  console.log(csvData)

  const getOrderColumns = () => {
    let columns = [
      { label: "이름", key: "name" },
      { label: "아이디", key: "loginId" },
      { label: "핸드폰번호", key: "phone" },
      { label: "이메일", key: "email" },
      { label: "계정생성일", key: "createdAt" },
      { label: "회원삭제", key: "delete_status" }
    ];

    return columns;
  };

  useEffect(() => {
    if (isSuccess) {
      setPageInfo({
        ...pageInfo,
        //@ts-ignore
        page: userList.nowPage || 1,
        //@ts-ignore
        total: userList.totalPage,
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    refetchUser();
  }, [pageInfo]);

  const onChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPageInfo({ ...pageInfo, page: value });
  };

  const onWithdraw = (item: any) => {
    const isConfirmed = window.confirm("회원을 삭제하시겠습니까?");
    if (isConfirmed) {
      setDeleteUserId(item.id);
      deleteUserMutation();
    }
  };

  return (
      <>
        <Wrapper>
          <h2>회원관리</h2>

          <Box sx={{textAlign: "right"}}>
            <Button variant="contained" color="info" startIcon={<DescriptionIcon />}>
              <CSVLink
                  data={csvData}
                  headers={getOrderColumns()}
                  filename={`회원관리`}
              >
                엑셀로 내보내기
              </CSVLink>
            </Button>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', marginTop: "20px" }}>
            <Tabs value={value} onChange={handleChange}>
              <Tab label="기업"/>
              <Tab label="개인"/>
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
                  {!userList?.data.length ? (
                      <TableRow>
                        <TableCell colSpan={tableColumns.length} align="center">
                          데이터가 없습니다
                        </TableCell>
                      </TableRow>
                  ) : (
                      <>
                        {userList?.data.map((item: any, idx: number) => (
                            <TableRow key={item.id}>
                              <TableCell align="center">{idx + 1}</TableCell>
                              <TableCell align="center">{item.name || "-"}</TableCell>
                              <TableCell align="center">{item.loginId || "-"}</TableCell>
                              <TableCell align="center">{item.phone || "-"}</TableCell>
                              <TableCell align="center">{item.email || "-"}</TableCell>
                              <TableCell align="center">
                                {dayjs(item.createdAt).format("YYYY-MM-DD") || "-"}
                              </TableCell>

                              <TableCell align="center">
                                <Link to={`/user/${item.id}`}>
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
            {!!userList?.data && (
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

export default UserPage;

const Wrapper = styled.div`
    padding: 30px;
    margin: 20px;
    background-color: #FFFFFF;

    > h1 {
        margin: 20px 0;
    }
`;
