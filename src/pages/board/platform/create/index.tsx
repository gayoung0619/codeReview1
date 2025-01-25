import styled from "styled-components";
import {Button, Card, CardMedia, Stack, TextField, Typography} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import {useState} from "react";
import {
  PlatformFormData,
  postPlatform
} from "../../../../api/board";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const PlatformCreatePage = () => {
  const navigate = useNavigate();
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const modules = {
    toolbar: [
      [{ header: '1'}, { header: '2'}, { font: [] }],
      [{ list: 'ordered'}, { list: 'bullet' }],
      ['bold', 'italic', 'underline'],
      [{ align: [] }],
      ['link', 'image'], // 이미지 삽입 버튼 추가
    ],
  };

  const [platformData, setPlatformData] = useState<PlatformFormData>({
    title: "",
    details: ""
  });

  const handleChange = (e: any | null, editorValue?: string) => {
    setPlatformData((prev) => {
      if (e) {
        const { name, value, checked, type } = e.target;
        return {
          ...prev,
          [name]: type === "checkbox" ? checked : value,
        };
      } else if (editorValue !== undefined) {
        return {
          ...prev,
          details: editorValue,
        };
      }
      return prev;
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
    mutationFn: (form: any) => postPlatform(form),
    onSuccess: () => {
      alert("등록되었습니다.");
      navigate(`/board/platform`)
    },
    onError: () => {
      alert("등록에 실패했습니다.");
    },
  });

  const onAdd = () => {
    const formData = new FormData();
    formData.append("title", platformData.title);
    formData.append("details", platformData.details);
    attachedFiles.forEach((file) => {
      formData.append("file", file);
    });
    postMutation(formData);
  }

  return (
      <>
        <Wrapper>
          <h2>플랫폼 등록하기</h2>

          <BoxWrapper>
            <div>
              <p>제목</p>
              <TextField
                  type="text"
                  id="standard-basic"
                  variant="standard"
                  name="title"
                  fullWidth
                  value={platformData.title}
                  onChange={handleChange}
              />
            </div>

            <div>
              <Typography variant="subtitle1">파일 첨부</Typography>
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

            <div>
              <p>문의 내용</p>
              <ReactQuill
                  value={platformData.details}
                  onChange={(value) => handleChange(null, value)}
                  modules={modules}
                  formats={['bold', 'italic', 'underline', 'link', 'image']}
                  style={{height: "300px"}}
              />
            </div>
          </BoxWrapper>

          <ButtonWrapper>
            <Button variant="contained" onClick={onAdd}>등록하기</Button>

            <Link to="/board/platform">
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
export default PlatformCreatePage
