import styled from "styled-components";
import {Button, Checkbox, FormControlLabel, TextField} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {getNoticeInfo, NoticeFormData, patchNotice} from "../../../../api/board";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const NoticeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const modules = {
    toolbar: [
      [{ header: '1'}, { header: '2'}, { font: [] }],
      [{ list: 'ordered'}, { list: 'bullet' }],
      ['bold', 'italic', 'underline'],
      [{ align: [] }],
      ['link', 'image'], // 이미지 삽입 버튼 추가
    ],
  };


  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setNoticeData({
      ...noticeData,
      [name]: type === "checkbox" ? checked : value, // Handle checkbox separately
    });
  };

  const handleEditorChange = (value: string) => {
    setNoticeData({
      ...noticeData,
      details: value,
    });
    console.log(noticeData.details)
  };

  const { data: noticeInfo } = useQuery({
    queryKey: ["noticeInfo", id],
    queryFn: () => getNoticeInfo(Number(id)),
    enabled: !!id,
  });

  const [noticeData, setNoticeData] = useState<NoticeFormData>({
    title: "",
    details: "",
    status: false,
  });

  useEffect(() => {
    if(noticeInfo?.data){
      setNoticeData({ ...noticeInfo?.data});
    }
  }, [noticeInfo]);

  const { mutate: patchMutation } = useMutation({
    mutationFn: (form: any) => patchNotice(id as string, form),
    onSuccess: () => {
      alert("수정되었습니다.");
      navigate(`/board/notice`)
    },
    onError: () => {
      alert("수정에 실패했습니다.");
    },
  });

  const onEdit = () => {
    patchMutation(noticeData)
  }

  return (
      <>
        <Wrapper>
          <h2>공지사항관리</h2>

          <BoxWrapper>
            <div>
              <p>제목</p>
              <TextField
                  type="text"
                  id="standard-basic"
                  variant="standard"
                  name="title"
                  fullWidth
                  value={noticeData.title}
                  onChange={handleChange}
              />
            </div>

            <div>
              <FormControlLabel
                  control={
                    <Checkbox
                        name="status"
                        checked={noticeData.status === true} // status가 true이면 체크됨
                        onChange={(e) => handleChange({
                          target: {
                            name: "status",
                            value: e.target.checked, // 체크되면 true, 해제되면 false
                          },
                        })}
                    />
                  }
                  label="상단 고정"
              />
            </div>

            <div>
              <p>문의 내용</p>
              <ReactQuill
                  value={noticeData.details}
                  onChange={handleEditorChange} modules={modules}
                  formats={['bold', 'italic', 'underline', 'link', 'image']}
                  style={{height: "auto"}}
              />
            </div>
          </BoxWrapper>

          <ButtonWrapper>
            <Button variant="contained" onClick={onEdit}>수정하기</Button>

            <Link to="/board/notice">
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

export default NoticeDetailPage
