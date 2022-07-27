import React from 'react';
import { Helmet } from 'react-helmet';


function SEO({pageTitle}) {
  let title = pageTitle
  return (
    <Helmet>
      {/* title */}
      <title>{ `tutti music | ${ title?title:"" }` }</title>
      {/* 메타태그 */}
      <meta name="description" content={title} />
      <meta name="image" content="https://file-bucket-seyeol.s3.ap-northeast-2.amazonaws.com/tutti%EC%84%9C%EB%B9%84%EC%8A%A4+%EB%9F%B0%EC%B9%AD+%EA%B2%80%EC%9D%80%EC%83%89+%EB%B0%94%ED%83%95+%ED%95%B8%EB%93%9C%ED%8F%B0%EC%9A%A9.jpg" />
      {/* 오픈 그래프 메타태그 */}
      <meta name="og:title" content={title} />
      <meta name="og:type" content="website" />
      <meta name="og:description" content="함께하는 음악 생활, tutti. 당신의 음악을 세상에 들려주세요." />
      <meta name="og:image" content="https://file-bucket-seyeol.s3.ap-northeast-2.amazonaws.com/tutti%EC%84%9C%EB%B9%84%EC%8A%A4+%EB%9F%B0%EC%B9%AD+%EA%B2%80%EC%9D%80%EC%83%89+%EB%B0%94%ED%83%95+%ED%95%B8%EB%93%9C%ED%8F%B0%EC%9A%A9.jpg" />
    </Helmet>
  )
}

export default SEO;