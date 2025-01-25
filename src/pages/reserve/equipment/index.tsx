import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem, Pagination,
  Paper,
  Select, Stack,
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow,
  TextField
} from "@mui/material";
import dayjs, {Dayjs} from "dayjs";
import {statusMap} from "../../../utils/reserveStatus.ts";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useMutation, useQuery} from "@tanstack/react-query";
import {getEquipmentList, patchEquipmentStatus} from "../../../api/reserve";
import styled from "styled-components";
import DescriptionIcon from "@mui/icons-material/Description";
import {CSVLink} from "react-csv";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {Bar} from "react-chartjs-2";

import {Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip} from 'chart.js';
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

interface EquipData {
  notebook: number;
  tablet: number
}

const EquipmentPage = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<string>("");
  const [keyword, setKeyword] = useState<string>("");
  const [searchCategory, setSearchCategory] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>(""); const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [formattedStartDate, setFormattedStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [formattedEndDate, setFormattedEndDate] = useState<string>("");
  const [updateStatus, setUpdateStatus] = useState<Record<string, string>>({});
  const [equipData, setEquipData] = useState<EquipData>({
    notebook: 0,
    tablet: 0
  });
  const equipValues = Object.values(equipData);
  const handleRowClick = (id: string) => {
    navigate(`/reserve/equipment/${id}`); // 각 row의 id를 URL에 포함
  };
  const tableColumns = ["No", "이름", "연락처", "대여일", "반납일", "대여물품", "사용목적", "신청일", "상태", "상세보기"];
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    total: null,
  });

  const onSearch = () => {
    setCategory(searchCategory);
    setKeyword(searchKeyword);
    setFormattedStartDate(startDate ? dayjs(startDate).format("YYYY-MM-DD"): "");
    setFormattedEndDate(endDate ? dayjs(endDate).format("YYYY-MM-DD"): "" );
  };

  const {
    data: equipmentList,
    refetch: refetchEquipment,
    isSuccess,
  } = useQuery({
    queryKey: ["equipmentList", pageInfo.page, category, keyword, formattedStartDate, formattedEndDate],
    queryFn: () => getEquipmentList(pageInfo.page, category, keyword, formattedStartDate, formattedEndDate),
  });

  //@ts-ignore
  const chartOptions= {
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
    },
  };

  const barChartData = equipData
      ? {
        labels: ["노트북", "태블릿"],
        datasets: [
          {
            label: '예약 수',
            data: equipValues, // Ensure this matches your data structure
            fill: false,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)',
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)',
            ],
            borderWidth: 1,
            categoryPercentage: 0.6,
            barPercentage: 0.6,
          },
        ],
      }
      : null;

  useEffect(() => {
    if (isSuccess && equipmentList) {
      // 페이지 정보 업데이트
      setPageInfo({
        //@ts-ignore
        page: equipmentList.nowPage || 1,
        //@ts-ignore
        total: equipmentList.totalPage || 1,
      });

      setEquipData({
        //@ts-ignore
        notebook: equipmentList.notebook,
        //@ts-ignore
        tablet: equipmentList.tablet,
      })

      // 상태 초기값 설정
      const initialStatuses = equipmentList.data.reduce((acc: Record<string, string>, item: any) => {
        acc[item.id] = item.status.toString();
        return acc;
      }, {});

      setUpdateStatus(initialStatuses);
    }
  }, [isSuccess, equipmentList]);

  useEffect(() => {
    refetchEquipment();
  }, [pageInfo]);

  const onChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPageInfo({ ...pageInfo, page: value });
  };


  const { mutate: patchStatusMutation } = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
        patchEquipmentStatus(id, status),
    onSuccess: () => {
      refetchEquipment();
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

  const csvData = equipmentList?.data?.map((item: any) => ({
    name: item.name || "-",
    phone: item.phone || "-",
    startDate: item.startDate || "-",
    endDate: item.endDate || "-",
    equipmentName: item.equipment?.name || "-",
    detail: item.detail || "-",
    createdAt: item.createdAt || "-",
    status: statusMap[item.status] || "-",
  })) || [];


  const getOrderColumns = () => {
    let columns = [
      { label: "이름", key: "name" },
      { label: "연락처", key: "phone" },
      { label: "대여일", key: "startDate" },
      { label: "반납일", key: "endDate" },
      { label: "대여물품", key: "equipmentName" },
      { label: "사용목적", key: "detail" },
      { label: "신청일", key: "createdAt" },
      { label: "상태", key: "status" }
    ];

    return columns;
  };

  return (
      <>
        <Wrapper>
          <h2>장비 예약관리</h2>
          <Box sx={{backgroundColor: "#F8F9FA", padding: "20px", borderRadius: "20px", marginTop: "10px"}}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                  label="시작 날짜"
                  value={startDate ? dayjs(startDate) : null}
                  onChange={(newValue: Dayjs | null) => setStartDate(newValue)}
                  sx={{backgroundColor: "#FFFFFF", marginRight: "10px"}}
                  //@ts-ignore
                  renderInput={(params: any) => <TextField {...params} />}
              />
              <DatePicker
                  label="종료 날짜"
                  value={endDate ? dayjs(endDate) : null}
                  onChange={(newValue: Dayjs | null) => setEndDate(newValue)}
                  sx={{backgroundColor: "#FFFFFF"}}
                  //@ts-ignore
                  renderInput={(params: any) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <Box mt={3}>
              <FormControl>
                <InputLabel id="cateLabel">
                  검색
                </InputLabel>
                <Select
                    labelId="cateLabel"
                    id="cateLabel"
                    value={searchCategory}
                    label="제목"
                    name="searchCategory"
                    onChange={(e) => setSearchCategory(e.target.value)}
                    sx={{minWidth: "100px", backgroundColor: "#ffffff"}}
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
                  sx={{margin: "0 10px", backgroundColor: "#ffffff"}}
              />
              <Button
                  variant="contained"
                  sx={{height: "56px", width: "80px", marginRight: "10px"}}
                  onClick={onSearch}
              >
                검색
              </Button>
            </Box>
          </Box>

          <div style={{width: '70%', marginTop: '20px'}}>
            <Bar data={barChartData as any} options={chartOptions as any}/>
          </div>

          <Box mt={3} sx={{display: "flex", justifyContent: "flex-end"}}>
            <Button variant="contained" color="info" startIcon={<DescriptionIcon/>}>
              <CSVLink
                  data={csvData}
                  headers={getOrderColumns()}
                  filename={`장비 예약관리`}
              >
                엑셀로 내보내기
              </CSVLink>
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
                  {!equipmentList?.data ? (
                      <TableRow>
                        <TableCell colSpan={tableColumns.length} align="center">
                          데이터가 없습니다
                        </TableCell>
                      </TableRow>
                  ) : (
                      <>
                        {equipmentList?.data.map((item: any, idx: number) => (
                            <TableRow key={item.id} style={{cursor: "pointer"}}>
                              <TableCell align="center">{idx + 1}</TableCell>
                              <TableCell align="center">{item.name || "-"}</TableCell>
                              <TableCell align="center">{item.phone || "-"}</TableCell>
                              <TableCell align="center">{dayjs(item.startDate).format("YYYY-MM-DD")}</TableCell>

                              <TableCell align="center">{dayjs(item.endDate).format("YYYY-MM-DD")}</TableCell>
                              <TableCell align="center">{item.equipment.name || "-"}</TableCell>
                              <TableCell align="center">{item.detail || "-"}</TableCell>
                              <TableCell align="center">
                                {dayjs(item.createdAt).format("YYYY-MM-DD") || "-"}
                              </TableCell>
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
                                    {Object.entries(statusMap).map(([key, value]) => (
                                        <MenuItem key={key} value={key}>
                                          {value}
                                        </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </TableCell>
                              <TableCell align="center">
                                <Button variant="contained" onClick={() => handleRowClick(item.id)}>상세보기</Button>
                              </TableCell>
                            </TableRow>
                        ))}
                      </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {!!equipmentList?.data && (
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
export default EquipmentPage