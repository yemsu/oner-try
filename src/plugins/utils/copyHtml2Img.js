import html2canvas from 'html2canvas'
import ALERTS from '../../constants/ALERTS'

const copyHtml2Img = async (element) => {
  const canvas = await html2canvas(element,{
    useCORS: true,
    allowTaint: true,
  })
  // const resultPromise = (_result) => 
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      const item = new ClipboardItem({'image/png': blob})
      navigator.clipboard.write([item]).then(
        () => {
          resolve(true)
        },
        () => {
          reject()
        }
      );
    })
  })
}

export default copyHtml2Img