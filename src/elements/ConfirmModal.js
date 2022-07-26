import React from 'react'

function ConfirmModal(props) {

    const { open, close, alert, clickDelete} = props;

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