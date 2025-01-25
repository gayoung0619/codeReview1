import styled from "styled-components";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, {Dayjs} from "dayjs";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getFacilityList, patchFacilityStatus } from "../../../api/reserve";
import { statusMap } from "../../../utils/reserveStatus.ts";
import 'react-datepicker/dist/react-datepicker.css';
import { Bar } from 'react-chartjs-2';

import DescriptionIcon from "@mui/icons-material/Description";
import {CSVLink} from "react-csv";

import {Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip} from 'chart.js';
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

interface Room {
  roomName: string;
  reservations: number;
}

interface RoomData {
  1: Room[];
  2: Room[];
  3: Room[];
  4: Room[];
  5: Room[];
  6: Room[];
}

const FacilityPage = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<string>("");
  const [keyword, setKeyword] = useState<string>("");
  const [searchCategory, setSearchCategory] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [formattedStartDate, setFormattedStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [formattedEndDate, setFormattedEndDate] = useState<string>("");
  const [sort, setSort] = useState<string>("");
  const [searchSort, setSearchSort] = useState<string>("");
  const [updateStatus, setUpdateStatus] = useState<Record<string, string>>({});
  const [roomData, setRoomData] = useState<RoomData>({
    1: [{ roomName: "305호", reservations: 0 }],
    2: [{ roomName: "오픈회의실", reservations: 0 }],
    3: [{ roomName: "308호", reservations: 0}],
    4: [{ roomName: "소회의실1", reservations: 0 }],
    5: [{ roomName: "소회의실2", reservations: 0 }],
    6: [{ roomName: "개별실습실", reservations: 0 }]
  });

  const handleRowClick = (id: string) => {
    navigate(`/reserve/facility/${id}`); // 각 row의 id를 URL에 포함
  };
  const tableColumns = [
    "No",
    "이름",
    "연락처",
    "이용날짜",
    "시설",
    "사용목적",
    "신청일",
    "상태",
    "상세보기",
  ];
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    total: null,
  });

  const onSearch = () => {
    setCategory(searchCategory);
    setKeyword(searchKeyword);
    setFormattedStartDate(startDate ? dayjs(startDate).format("YYYY-MM-DD"): "");
    setFormattedEndDate(endDate ? dayjs(endDate).format("YYYY-MM-DD"): "" );
    setSort(searchSort)
  };

  const {
    data: FacilityList,
    refetch: refetchFacility,
    isSuccess,
  } = useQuery({
    queryKey: ["FacilityList", pageInfo.page, category, keyword, formattedStartDate, formattedEndDate, sort],
    queryFn: () => {
      return getFacilityList(pageInfo.page, category, keyword, formattedStartDate, formattedEndDate, sort)
    }
  });

  const chartOptions = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    }
  };

  //@ts-ignore
  const barChartData = roomData
      ? {
        labels: Object.values(roomData).map((room) => room[0].roomName),
        datasets: [
          {
            label: '예약 수',
            data: Object.values(roomData).map((room) => room[0].reservations),
            fill: false,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
            ],
            borderWidth: 1
          },
        ],
      }
      : null;

  useEffect(() => {
    if (isSuccess && FacilityList) {
      // 페이지 정보 업데이트
      setPageInfo({
        //@ts-ignore
        page: FacilityList.nowPage || 1,
        //@ts-ignore
        total: FacilityList.totalPage || 1,
      });

      setRoomData((prevRoomData) => {
        const updatedRoomData = { ...prevRoomData };

        //@ts-ignore
        const statistics = FacilityList.statistics;

        Object.keys(statistics).forEach((key) => {
          const roomNumber = Number(key);
          //@ts-ignore
          if (updatedRoomData[roomNumber]) {
            //@ts-ignore
            updatedRoomData[roomNumber][0].reservations = statistics[key];
          }
        });

        return updatedRoomData;
      });


      const initialStatuses = FacilityList.data.reduce(
        (acc: Record<string, string>, item: any) => {
          acc[item.reserveId] = item.status; // id를 키로, status를 값으로 저장
          return acc;
        },
        {}
      );

      setUpdateStatus(initialStatuses);
    }
  }, [isSuccess, FacilityList]);

  useEffect(() => {
    refetchFacility();
  }, [pageInfo]);

  const onChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPageInfo({ ...pageInfo, page: value });
  };

  const { mutate: patchStatusMutation } = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      patchFacilityStatus(id, status),
    onSuccess: () => {
      refetchFacility();
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

  const csvData = FacilityList?.data?.map((item: any) => ({
    name: item.name || "-",
    phone: item.phone || "-",
    reserveDate: item.reserveDate || "-",
    facilityName: item.facility?.name || "-",
    detail: item.detail || "-",
    createdAt: item.createdAt || "-",
    status: statusMap[item.status] || "-",
  })) || [];


  const getOrderColumns = () => {
    let columns = [
      { label: "이름", key: "name" },
      { label: "연락처", key: "phone" },
      { label: "이용날짜", key: "reserveDate" },
      { label: "시설", key: "facilityName" },
      { label: "사용목적", key: "detail" },
      { label: "신청일", key: "createdAt" },
      { label: "상태", key: "status" }
    ];

    return columns;
  };
  return (
    <>
      <Wrapper>
        <h2>시설 예약관리</h2>
        <Box sx={{ backgroundColor: "#F8F9FA", padding: "20px", borderRadius: "20px", marginTop: "10px" }}>
          <FormControl sx={{width: "150px", backgroundColor: "#ffffff"}}>
            <InputLabel id="sort-label">정렬</InputLabel>
            <Select
                labelId="sort-label"
                label="정렬"
                value={searchSort}
                name="setSort"
                onChange={(e: any) => setSearchSort(e.target.value)}
            >
              <MenuItem value=" ">선택 안함</MenuItem>
              <MenuItem value="createdAt">신청일 별</MenuItem>
              <MenuItem value="reserveDate">이용날짜 별</MenuItem>
            </Select>
          </FormControl>
          <Box mt={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                  label="시작 날짜"
                  value={startDate ? dayjs(startDate) : null}
                  onChange={(newValue: Dayjs | null) => setStartDate(newValue)}
                  sx={{backgroundColor: "#FFFFFF", marginRight: "10px", width: '150px'}}
                  //@ts-ignore
                  renderInput={(params: any) => <TextField {...params} />}
              />
              <DatePicker
                  label="종료 날짜"
                  value={endDate ? dayjs(endDate) : null}
                  onChange={(newValue: Dayjs | null) => setEndDate(newValue)}
                  sx={{backgroundColor: "#FFFFFF", width: '150px'}}
                  //@ts-ignore
                  renderInput={(params: any) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>
          <Box mt={3}>
            <FormControl>
              <InputLabel id="cateLabel">검색</InputLabel>
              <Select
                  labelId="cateLabel"
                  id="cateLabel"
                  value={searchCategory}
                  label="제목"
                  name="searchCategory"
                  onChange={(e: any) => setSearchCategory(e.target.value)}
                  sx={{ minWidth: "150px", backgroundColor: "#ffffff" }}
              >
                <MenuItem value={"1"}>이름</MenuItem>
                <MenuItem value={"2"}>내용</MenuItem>
                <MenuItem value={"3"}>이름 + 내용</MenuItem>
              </Select>
            </FormControl>
            <TextField
                required
                rows={1}
                name={"searchKeyword"}
                value={searchKeyword || ""}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="검색어를 입력해주세요"
                sx={{ margin: "0 10px", backgroundColor: "#ffffff" }}
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

        <div style={{ width: '70%', marginTop: '20px' }}>
          <Bar data={barChartData as any} options={chartOptions as any} />
        </div>

        <Box mt={3} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="info" startIcon={<DescriptionIcon />}>
            <CSVLink
                data={csvData}
                headers={getOrderColumns()}
                filename={`시설 예약관리`}
            >
              엑셀로 내보내기
            </CSVLink>
          </Button>
        </Box>


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
                {!FacilityList?.data.length ? (
                  <TableRow>
                    <TableCell colSpan={tableColumns.length} align="center">
                      데이터가 없습니다
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {FacilityList?.data.map((item: any, idx: number) => (
                      <TableRow key={item.id} style={{ cursor: "pointer" }}>
                        <TableCell align="center">{idx + 1}</TableCell>
                        <TableCell align="center">{item.name || "-"}</TableCell>
                        <TableCell align="center">
                          {item.phone || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {dayjs(item.reserveDate).format("YYYY-MM-DD")}
                        </TableCell>
                        <TableCell align="center">
                          {item.facility.name || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {item.detail || "-"}
                        </TableCell>
                        <TableCell align="center">
                          {dayjs(item.createdAt).format("YYYY-MM-DD") || "-"}
                        </TableCell>
                        <TableCell align="center">
                          <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="status">상태</InputLabel>
                            <Select
                              labelId="status"
                              id="status"
                              label="상태"
                              value={updateStatus[item.reserveId] || ""}
                              onChange={(e) =>
                                handleStatusChange(
                                  item.reserveId,
                                  e.target.value
                                )
                              }
                            >
                              {Object.entries(statusMap).map(([key, value]) => (
                                <MenuItem key={key} value={key}>
                                  {value}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            onClick={() => handleRowClick(item.reserveId)}
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
          {!!FacilityList?.data && (
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
export default FacilityPage;
