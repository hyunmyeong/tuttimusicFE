import { useContext, useEffect, useCallback } from 'react';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

export function useBlocker(blocker, when = true) {
  const navigate = useNavigate();
	const { navigator } = useContext(NavigationContext);

	useEffect((e) => {
    //false 이면 출력
		if(!when) 
    {return}
    
		
    //true 이면 unblock 출력
		const unblock = navigator.block((tx) => {
			const autoUnblockingTx = {
				...tx,
				retry() {
					unblock();
					tx.retry();
				},
			};
			blocker(autoUnblockingTx);
		});
		return unblock;
    
	}, [navigator, blocker, when]);
}


export function usePrompt(message, when = true) {
	const blocker = useCallback((tx) => {
		//   eslint-disable-next-line no-alert
		if(window.confirm(message)) tx.retry();
	}, [message]);
	
	useBlocker(blocker, when);
}