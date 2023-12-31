import Transfer from '@/types/Transfer';
import axios from 'axios';
import { useRouter } from 'next/router';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import { LiaEditSolid } from 'react-icons/lia';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const ownApiPath = process.env.NEXT_PUBLIC_OWN_API_PATH;

interface Props {
  title: string;
  transferId: number;
  setErrorMsg: (msg: string) => void;
}

type HoverName = 'div' | 'edit' | 'delete';

const TransferTitle: React.FC<Props> = ({ title, transferId, setErrorMsg }) => {
  const router = useRouter();
  const titleDiv = useRef(null);
  const [isHover, setIsHover] = useState(false);
  const [isHoverEdit, setIsHoverEdit] = useState(false);
  const [isHoverDelete, setIsHoverDelete] = useState(false);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(title);
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const titleInput = useRef<HTMLInputElement>(null);
  const titleEditDiv = useRef<HTMLDivElement>(null);

  const toggle = () => setModal(!modal);

  const handleMouseOver = (name: HoverName) => {
    if (name == 'div') {
      setIsHover(true);
    } else if (name == 'edit') {
      setIsHoverEdit(true);
    } else if (name == 'delete') {
      setIsHoverDelete(true);
    } else {
      throw new Error('到達し得ないコードに到達しました');
    }
  };

  const handleMouseOut = (name: HoverName) => {
    if (name == 'div') {
      setIsHover(false);
    } else if (name == 'edit') {
      setIsHoverEdit(false);
    } else if (name == 'delete') {
      setIsHoverDelete(false);
    } else {
      throw new Error('到達し得ないコードに到達しました');
    }
  };

  const editIconStyle: CSSProperties = {
    marginLeft: 'auto',
  };

  const deleteIconStyle: CSSProperties = {
    marginLeft: '20px',
  };

  const hoverStyle: CSSProperties = {
    background: 'rgba(2, 2, 2, 0.2)',
  };

  const handleClickDeleteTransfer = async () => {
    try {
      await axios.delete(`${ownApiPath}/api/transfer/delete?id=${transferId}`);
      console.log('振替ページを1件削除しました');
      router.push('/');
    } catch (error) {
      setErrorMsg('削除に失敗しました');
    }
    toggle();
  };

  const handleClickUpdateTransferTitle = async () => {
    try {
      const newTransfer: Transfer = {
        id: transferId,
        title: editingTitle,
      };
      await axios.patch(`${ownApiPath}/api/transfer/update`, newTransfer);
      console.log('Transferのタイトルを更新しました');
      setUpdatedTitle(editingTitle);
    } catch (error) {
      setErrorMsg('タイトルの更新に失敗しました');
    } finally {
      setEditing(false);
    }
  };

  const handleClickEditIcon = async () => {
    await setEditing(true);
    if (titleInput.current) {
      titleInput.current.focus();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!editing) return;

      if (titleEditDiv.current && !titleEditDiv.current.contains(event.target as Node)) {
        setEditing(false);
      }
    };

    // グローバルなクリックイベントリスナーを追加
    document.addEventListener('click', handleClickOutside);

    // コンポーネントがアンマウントされた時にクリックイベントリスナーを削除
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      <Modal isOpen={modal} toggle={toggle} size="lg" backdrop={true} fade>
        <ModalHeader toggle={toggle} close={<></>}>
          振替ページ削除
        </ModalHeader>
        <ModalBody>
          この振替ページを削除することで
          <br />
          Temporary Transferの情報も削除されますがよろしいですか？
        </ModalBody>
        <ModalFooter style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button color="secondary" onClick={toggle}>
            キャンセル
          </Button>{' '}
          <Button color="danger" onClick={handleClickDeleteTransfer}>
            削除
          </Button>
        </ModalFooter>
      </Modal>

      <div
        ref={titleDiv}
        onMouseOver={() => handleMouseOver('div')}
        onMouseOut={() => handleMouseOut('div')}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        {editing ? (
          <div ref={titleEditDiv} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Input
              innerRef={titleInput}
              onChange={(e) => setEditingTitle(e.target.value)}
              value={editingTitle}
              style={{ fontSize: 36, height: 50 }}
            />
            <Button
              color="primary"
              outline
              onClick={handleClickUpdateTransferTitle}
              style={{ whiteSpace: 'nowrap', height: 50, marginBottom: 20, marginLeft: 40 }}
            >
              確定
            </Button>
          </div>
        ) : (
          <>
            <h1>{updatedTitle}</h1>
            {isHover && (
              <>
                <LiaEditSolid
                  size={30}
                  style={isHoverEdit ? { ...editIconStyle, ...hoverStyle } : editIconStyle}
                  onMouseOver={() => handleMouseOver('edit')}
                  onMouseOut={() => handleMouseOut('edit')}
                  onClick={handleClickEditIcon}
                />
                <RiDeleteBin5Line
                  size={30}
                  style={isHoverDelete ? { ...deleteIconStyle, ...hoverStyle } : deleteIconStyle}
                  onMouseOver={() => handleMouseOver('delete')}
                  onMouseOut={() => handleMouseOut('delete')}
                  onClick={toggle}
                />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default TransferTitle;
