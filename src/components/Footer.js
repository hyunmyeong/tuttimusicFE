import React from 'react';
import ImageUrl from '../elements/ImageSrc';

function Footer() {
  return (
    <div className="Footer">
    <div className="footer-wrap">
      <div className="footer-box">
        <img
        className="logo" 
        src={ImageUrl.logo_b}
        />
      </div>
      <div className="footer-box footer-left">
      <div className="footer-about">
        <a 
        className="footer-about-about"
        target="blank"
        href="https://fluoridated-shell-c1f.notion.site/About-tutti-78df41db1a2c4e08949891dcdb8098a7">
          About</a>
        <a 
        className="footer-about-about"
        target="blank"
        href="https://fluoridated-shell-c1f.notion.site/87239be82548471fb8e70efedbd35b5d">
          개인정보처리방침</a>
        <a 
        className="footer-about-about"
        target="blank"
        href="https://fluoridated-shell-c1f.notion.site/e88337be613f4069a30b367254d0d71b">
          이용약관</a>
        <a 
        className="footer-about-about"
        target="blank"
        href="https://fluoridated-shell-c1f.notion.site/aad2793ef4fc4e8295cefefb58430077">
        Q & A</a>
        
        </div>
      </div>

    </div>
    </div>
  )
}


export default Footer;