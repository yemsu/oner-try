import html2canvas from 'html2canvas'
import ALERTS from '../../constants/ALERTS'

const copyHtml2Img = async (element) => {
  const canvas = await html2canvas(element,{
    useCORS: true,
    allowTaint: true,
  })
  canvas.toBlob(blob => {
    const item = new ClipboardItem({'image/png': blob})
    try {
      navigator.clipboard.write([item])
      alert(ALERTS.ITEM_SETTING.CLIPBOARD_SUCCESS)
    } catch(e) {
      alert(ALERTS.ITEM_SETTING.CLIPBOARD_FAIL)
    }
  })
}

export default copyHtml2Img