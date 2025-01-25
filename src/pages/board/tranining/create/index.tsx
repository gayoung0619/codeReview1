import styled from "styled-components";
import {
  Button,
  Card,
  CardMedia, Checkbox,
  FormControl, FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import {useState} from "react";
import {postTraining, TrainingFormData} from "../../../../api/board";
import "react-quill/dist/quill.snow.css";

const TrainingCreatePage = () => {
  const navigate = useNavigate();
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const options = [
    { label: '재직자', name: '재직자' },
    { label: '미래인재', name: '미래인재' },
    { label: '일반인', name: '일반인' }
  ];

  const [trainingData, setTrainingData] = useState<TrainingFormData>({
    title: "",
    category: "",
    open_date: "",
    time: "",
    url:"",
    file: "",
    target: []
  });

  const handleChange = (e: any) => {
    const { name, value, checked, type } = e.target;

    setTrainingData((prev) => {
      if (type === "checkbox") {
        return {
          ...prev,
          target: checked
              ? [...prev.target, value] // Add value if checked
              : prev.target.filter((item: string) => item !== value), // Remove value if unchecked
        };
      } else {
        return {
          ...prev,
          [name]: value,
        };
      }
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


  const { mutate: postMutation } = useMutation({
    mutationFn: (form: any) => postTraining(form),
    onSuccess: () => {
      alert("등록되었습니다.");
      navigate(`/board/training`)
    },
    onError: () => {
      alert("등록에 실패했습니다.");
    },
  });

  console.log(trainingData)

  const onAdd = () => {
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
    postMutation(formData);
  }
  return (
      <>
        <Wrapper>
          <h2>디지털훈련/트레이닝 등록하기</h2>

          <BoxWrapper>
            <div>
              <p>카테고리</p>
              <FormControl variant="outlined" sx={{width: "200px"}}>
                <InputLabel id="training-select-label" sx={{backgroundColor: "#fff"}}>선택해주세요</InputLabel>
                <Select
                    labelId="training-select-label"
                    id="training-select"
                    name="category"
                    value={trainingData.category}
                    onChange={handleChange}
                    label="카테고리"
                >
                  <MenuItem value={1}>디지털훈련</MenuItem>
                  <MenuItem value={2}>디지털트레이닝</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div>
              <p>제목</p>
              <TextField
                  type="text"
                  id="standard-basic"
                  name="title"
                  fullWidth
                  value={trainingData.title}
                  onChange={handleChange}
                  placeholder={"제목을 입력해주세요."}
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
                            checked={trainingData.target.includes(option.name)} // target 배열에 해당 값이 있으면 체크
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
                  name="url"
                  fullWidth
                  value={trainingData.url}
                  onChange={handleChange}
                  placeholder={"링크URL을 입력해주세요."}
              />
            </div>

            <div>
              <p>교육일정</p>
              <TextField
                  type="text"
                  id="standard-basic"
                  name="open_date"
                  fullWidth
                  value={trainingData.open_date}
                  onChange={handleChange}
                  placeholder={"교육일정을 입력해주세요."}
              />
            </div>

            <div>
              <p>교육시간</p>
              <TextField
                  type="text"
                  id="standard-basic"
                  name="time"
                  fullWidth
                  value={trainingData.time}
                  onChange={handleChange}
                  placeholder={"교육시간을 입력해주세요."}
              />
            </div>

            <div>
              <p>썸네일 이미지</p>
              <Button
                  variant="outlined"
                  component="label"
                  color="primary"
                  sx={{mt: 1}}
              >
                파일 선택
                <input
                    type="file"
                    multiple
                    hidden
                    onChange={handleFileChange}
                />
              </Button>
              <Stack direction="row" spacing={2} sx={{mt: 2}} flexWrap="wrap">
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
                            sx={{objectFit: "cover", height: "100%"}}
                        />
                        <Button
                            onClick={() => removeFile(index)}
                            sx={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              width: '20px',
                              height: '20px',
                              backgroundColor: "#fff",
                              minWidth: "unset",
                              padding: "4px",
                              borderRadius: "50%",
                              color: '#000'
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
            <Button variant="contained" onClick={onAdd}>등록하기</Button>

            <Link to="/board/training">
              <Button variant="contained">목록가기</Button>
            </Link>
          </ButtonWrapper>
        </Wrapper>
      </>
  )
}


const Wrapper = styled.div`
    padding: 30px;
    margin: 20px;
    background-color: #FFFFFF;
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
export default TrainingCreatePage
