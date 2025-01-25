import styled from "styled-components";
import {
  Button,
  Card,
  CardMedia,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  BannerFormData,
  getBannerInfo,
  patchBanner,
} from "../../../api/banner";

const BannerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const { data: bannerInfo } = useQuery({
    queryKey: ["bannerInfo", id],
    queryFn: () => getBannerInfo(Number(id)),
    enabled: !!id,
  });

  const [bannerData, setBannerData] = useState<BannerFormData>({
    file_name: "",
    file_url: "",
    file: "",
    sort: "",
    status: false,
  });

  useEffect(() => {
    if (bannerInfo?.data) {
      setBannerData({ ...bannerInfo?.data });
    }
  }, [bannerInfo]);

  const { mutate: patchMutation } = useMutation({
    mutationFn: (form: any) => patchBanner(id as string, form),
    onSuccess: (res) => {
      //@ts-ignore
      alert(res.content);
      navigate(`/banner`);
    },
    onError: () => {
      alert("수정에 실패했습니다.");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachedFiles(newFiles);
    }
  };
  const removeFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };
  const handleChange = (e: any | null) => {
    setBannerData((prev: any) => {
      if (e) {
        const { name, value, checked, type } = e.target;
        return {
          ...prev,
          [name]: type === "checkbox" ? checked : value,
        };
      }
    });
  };

  const onEdit = () => {
    // if (attachedFiles.length === 0) {
    //   alert("파일을 첨부해주세요.");
    //   return;
    // }
    const formData = new FormData();
    formData.append("file_name", bannerData.file_name);
    formData.append("sort", bannerData.sort);
    formData.append("status", bannerData.status.toString());
    if (attachedFiles.length > 0) {
      formData.append("file", attachedFiles[0]); // 첫 번째 파일만 추가
    }
    patchMutation(formData);
  };
  return (
    <>
      <Wrapper>
        <h2>배너관리</h2>

        <BoxWrapper>
          <div>
            <p>이미지파일</p>
            {bannerData.file_url ? (
              <img src={bannerData.file_url} alt="현재이미지" />
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

          <div>
            <FormControl sx={{ width: "200px", marginTop: "30px" }}>
              <InputLabel
                id="sort-select-label"
                sx={{ backgroundColor: "#fff" }}
              >
                노출순서
              </InputLabel>
              <Select
                labelId="sort-select-label"
                name="sort"
                value={bannerData.sort || ""}
                onChange={handleChange}
              >
                {[1, 2, 3, 4, 5].map((number) => (
                  <MenuItem key={number} value={number}>
                    {number}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div>
            <FormControlLabel
              control={
                <Switch
                  name="status"
                  checked={bannerData.status === true}
                  onChange={handleChange}
                />
              }
              label="노출 여부"
            />
          </div>
        </BoxWrapper>

        <ButtonWrapper>
          <Button variant="contained" onClick={onEdit}>
            수정하기
          </Button>

          <Link to="/banner">
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

export default BannerDetailPage;
