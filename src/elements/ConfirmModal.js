import React from 'react'

function ConfirmModal(props) {

    const { open, close, alert, clickDelete} = props;

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
        <div className={open ? 'openModal modal' : 'modal'}>
            

            {open ? (
                <section>
                        <main>{alert}</main>
                    <footer className='confirm-footer'>
                        <button className='modal-delete-button' onClick={clickDelete}>확인</button>
                        <button className="modal-close-button" onClick={close}>취소</button>
                    </footer>
                </section>
            ) : null}

        </div>
    )
}

export default ConfirmModal