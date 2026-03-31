const url = 'https://m.blog.naver.com/statscout/224234881551?referrerCode=1';
fetch(url).then(res=>res.text()).then(text=>{
  const metaMatch = text.match(/<meta\s+property=\"og:image\"\s+content=\"([^"]+)\"/i);
  if(metaMatch) {
    console.log(metaMatch[1]);
  } else {
    console.log("No OG image");
  }
});
