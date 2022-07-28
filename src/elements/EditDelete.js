import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from "../redux/modules/songSlice";
import axios from 'axios';
import styled from 'styled-components';

import Modal from '../elements/Modal'
import ConfirmModal from './ConfirmModal';

function EditDelete(props) {

  const id = props.id;
  const detail = props.detail;
  const token = props.token;


  //모달
  const [alert, setAlert] = useState("삭제하시겠습니까?")
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {setModalOpen(true);};
  const closeModal = () => {
    setModalOpen(false);
    axios.delete(`${SERVER_URL}/feeds/${id}`,{
      headers: {
        Authorization: token ? token : ""}
    })
    .then((response) => {
      navigate("/musicfeed");
      window.scrollTo(0, 0);
    })
    .catch((error) => {
    });
  };

  const [confirm, setComfirm] = useState("삭제하시겠습니까?");
  const [confirmOpen, setComfirmOpen] = useState(false);
  const openConfirm = () => {setComfirmOpen(true);};
  const closeConfirm = () => {setComfirmOpen(false);};
  const clickDelete = () => {
    setComfirmOpen(false); 
    setModalOpen(true); 
    setAlert("삭제되었습니다.")
  };


  const navigate = useNavigate();

  const GoEdit = () => {
    navigate(`/edit/${id}`, {state: detail});
    window.scrollTo(0, 0);
  }

  //delete this post
  const GoDelete = () => { 
    openConfirm()
  }
  return (
    <EditDeleteWrap>
    <div className="go-edit" onClick={GoEdit}>수정</div> | 
    <div className="go-delete" onClick={GoDelete}>삭제</div>
    <Modal open={modalOpen} close={closeModal} alert={alert}/>
    <ConfirmModal open={confirmOpen} close={closeConfirm} alert={alert} clickDelete={clickDelete}/>
    </EditDeleteWrap>
  )
}

let EditDeleteWrap = styled.div`
display: flex;
flex-direction: row;
color: #D9D9D9;
cursor: default;

.go-edit {
  margin-right: 12px;
  color: #7E7E7E;
  cursor: pointer;
}

.go-delete {
  margin-left: 12px;
  color: #7E7E7E;
  cursor: pointer;
}
`

export default EditDelete;