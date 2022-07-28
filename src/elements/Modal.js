import React from 'react';

const Modal = (props) => {
  // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
    const { open, close, alert} = props;

    React.useEffect(() => {
      if (open === true) {
        document.body.style.cssText = `
        position: fixed; 
        top: -${window.scrollY}px;
        overflow-y: scroll;
        width: 100%;`;
        return () => {
          const scrollY = document.body.style.top;
          document.body.style.cssText = '';
          window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
        };
      }
    },[open])



    return (
    // 모달이 열릴때 openModal 클래스가 생성
        <div className={open ? 'openModal modal' : 'modal'}>
            
            {open ? (
            <section>
                    <main>{alert}</main>
                <footer>
                    <button className="modal-close-button" 
                        onClick={()=>{
                            close()
                        }}>
                        확인
                    </button>
                </footer>
            </section>
            ) : null}

    </div>
);
};

export default Modal;