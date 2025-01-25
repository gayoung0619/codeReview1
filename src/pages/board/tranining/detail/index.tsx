import styled from "styled-components";
import {
  Button,
  Card,
  CardMedia,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getTrainingInfo,
  patchTraining,
  TrainingFormData,
} from "../../../../api/board";
import "react-quill/dist/quill.snow.css";
import "react-datepicker/dist/react-datepicker.css";

// 더 필요한 차트 모듈 등록
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const TrainingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const options = [
    { label: "재직자", name: "재직자" },
    { label: "미래인재", name: "미래인재" },
    { label: "일반인", name: "일반인" },
  ];

  const { data: trainingInfo } = useQuery({
    queryKey: ["trainingInfo", id],
    queryFn: () => getTrainingInfo(Number(id)),
    enabled: !!id,
  });

  console.log(trainingInfo);

  const [trainingData, setTrainingData] = useState<TrainingFormData>({
    title: "",
    category: "",
    open_date: "",
    time: "",
    url: "",
    file: "",
    thumbnails: "",
    target: [],
  });

  useEffect(() => {
    if (trainingInfo?.data) {
      setTrainingData((prev) => ({
        ...prev,
        ...trainingInfo.data,
      }));
    }
  }, [trainingInfo]);

  const handleChange = (e: any) => {
    setTrainingData((prev) => {
      const { name, value, checked, type } = e.target;

      if (type === "checkbox") {
        let updatedTarget = [...prev.target];

        if (checked) {
          updatedTarget.push(name);
        } else {
          updatedTarget = updatedTarget.filter((item) => item !== name);
        }

        return {
          ...prev,
          target: updatedTarget,
        };
      }

      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value, // 다른 타입일 경우, value 사용
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachedFiles([...attachedFiles, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const { mutate: patchMutation } = useMutation({
    mutationFn: (form: any) => patchTraining(id as string, form),
    onSuccess: () => {
      alert("수정되었습니다.");
      navigate(`/board/training`);
    },
    onError: () => {
      alert("수정에 실패했습니 다.");
    },
  });

  const onEdit = () => {
    // title, url, attachedFiles가 빈값일 경우 알림 표시
    if (!trainingData.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!trainingData.url.trim()) {
      alert("URL을 입력해주세요.");
      return;
    }
    // if (attachedFiles.length === 0) {
    //   alert("파일을 첨부해주세요.");
    //   return;
    // }
    const formData = new FormData();
    formData.append("title", trainingData.title);
    formData.append("url", trainingData.url);
    formData.append("open_date", trainingData.open_date);
    formData.append("time", trainingData.time);
    formData.append("category", trainingData.category);
    trainingData.target.forEach((item) => {
      formData.append("target", item);
    });
    attachedFiles.forEach((file) => {
      formData.append("file", file);
    });
    patchMutation(formData);
  };

  return (
    <>
      <Wrapper>
        <h2>디지털훈련/트레이닝 수정하기</h2>

        <BoxWrapper>
          <div>
            <p>제목</p>
            <TextField
              type="text"
              id="standard-basic"
              variant="standard"
              name="title"
              fullWidth
              value={trainingData.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <p>주요 수강생</p>
            {options.map((option) => (
              <FormControlLabel
                key={option.name}
                value={option.name}
                control={
                  <Checkbox
                    checked={trainingData.target.includes(option.name)}
                    onChange={handleChange}
                    name={option.name}
                    color="primary"
                  />
                }
                label={option.label}
              />
            ))}
          </div>

          <div>
            <p>링크 URL</p>
            <TextField
              type="text"
              id="standard-basic"
              variant="standard"
              name="url"
              fullWidth
              value={trainingData.url}
              onChange={handleChange}
            />
          </div>

          <div>
            <p>교육일정</p>
            <TextField
              type="text"
              id="standard-basic"
              variant="standard"
              name="open_date"
              fullWidth
              value={trainingData.open_date}
              onChange={handleChange}
            />
          </div>

          <div>
            <p>교육시간</p>
            <TextField
              type="text"
              id="standard-basic"
              variant="standard"
              name="time"
              fullWidth
              value={trainingData.time}
              onChange={handleChange}
            />
          </div>

          <div>
            <p>썸네일 이미지</p>
            {trainingData.thumbnails ? (
              <img src={trainingData.thumbnails} alt="현재이미지" />
            ) : (
              <p style={{ fontSize: "14px" }}>(이미지를 등록해주세요)</p>
            )}
            <Button
              variant="outlined"
              component="label"
              color="primary"
              sx={{ mt: 1 }}
            >
              파일 선택
              <input type="file" multiple hidden onChange={handleFileChange} />
            </Button>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }} flexWrap="wrap">
              {attachedFiles.map((file, index) => {
                const imageUrl = URL.createObjectURL(file); // 이미지 URL 생성
                return (
                  <Card
                    key={index}
                    sx={{
                      width: 120,
                      height: 120,
                      position: "relative",
                      overflow: "hidden",
                      border: "1px solid #ddd",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={imageUrl}
                      alt={`첨부된 이미지 ${index + 1}`}
                      sx={{ objectFit: "cover", height: "100%" }}
                    />
                    <Button
                      onClick={() => removeFile(index)}
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        width: "20px",
                        height: "20px",
                        backgroundColor: "#fff",
                        minWidth: "unset",
                        padding: "4px",
                        borderRadius: "50%",
                        color: "#000",
                      }}
                    >
                      ✕
                    </Button>
                  </Card>
                );
              })}
            </Stack>
          </div>
        </BoxWrapper>

        <ButtonWrapper>
          <Button variant="contained" onClick={onEdit}>
            수정하기
          </Button>

          <Link
            to={`/board/training?type=${
              trainingInfo?.data.category === 1 ? 1 : 2
            }`}
          >
            <Button variant="contained">목록가기</Button>
          </Link>
        </ButtonWrapper>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  padding: 30px;
  margin: 20px;
  background-color: #ffffff;
`;

const BoxWrapper = styled.div`
  margin-top: 40px;

  > div {
    width: 100%;
    margin-top: 10px;

    > p {
      font-size: 18px;
      color: #121828;
      font-weight: 600;
      margin-bottom: 8px;
    }

    > div {
      margin-bottom: 10px;
    }
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 100px;
  width: 100%;
`;

export default TrainingDetailPage;
