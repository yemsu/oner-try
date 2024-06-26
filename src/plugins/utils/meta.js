const setMeta = (metaObj = {}) => {
  const { description, url, title  } = metaObj
  const resultMeta = []
  const defaultDesc = 'Warcraft3 Onepiece RPG 정보 제공 사이트'
  if(Object.keys(metaObj).length === 0) return []

  // description
  const descContent = defaultDesc + (description || '')
  resultMeta.push({ hid: 'description', name: 'description', content: descContent })
  resultMeta.push({ hid: 'og-description-value', property: 'og:description', content: descContent })
  resultMeta.push({ hid: 'twitter-description-value', name: 'twitter:description', content: descContent })
  resultMeta.push({ hid: 'schema-description-value', itemprop: 'description', content: descContent })

  // url
  const urlContent = process.env.BASE_URL + (url || '')
  resultMeta.push({ hid: 'og-url-value', property: 'og:url', content: urlContent })
  resultMeta.push({ hid: 'twitter-url-value', name: 'twitter:url', content: urlContent })
  resultMeta.push({ hid: 'schema-url-value', itemprop: 'url', content: urlContent })
    
  // title
  const defaultTitle = `${process.env.NODE_ENV === 'development' ? 'LOCAL | ' : ''}${process.env.APP_TITLE} | 워크래프트3 원피스 RPG 정보 제공 사이트`
  const titleContent = (title ? `${title} | ` : '') + defaultTitle
  resultMeta.push({ title: titleContent })
  resultMeta.push({ hid: 'og-title-value', property: 'og:title', content: titleContent })
  resultMeta.push({ hid: 'twitter-title-value', name: 'twitter:title', content: titleContent })
  resultMeta.push({ hid: 'schema-name-value', itemprop: 'name', content: titleContent })
  
  // image
  const imgContent = metaObj?.imageUrl
    ? `${process.env.BASE_URL}/images${metaObj.imageUrl}`
    : `${process.env.BASE_URL}/images/items/static/image/sailor/s1227899974.png`
  resultMeta.push({ hid: 'og-image-value', property: 'og:image', content: imgContent })
  
  return { title: titleContent, meta: resultMeta } || []
}

export default setMeta