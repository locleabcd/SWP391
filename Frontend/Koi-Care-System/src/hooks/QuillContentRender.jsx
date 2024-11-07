import React, { useEffect, useRef } from 'react'
import Quill from 'quill'

function QuillContentRenderer({ content }) {
  const quillRef = useRef(null)

  useEffect(() => {
    if (quillRef.current) {
      const quill = new Quill(quillRef.current, {
        theme: 'snow',
        readOnly: true,
        modules: { toolbar: false }
      })
      quill.root.innerHTML = content
    }
  }, [content])

  return (
    <div
      ref={quillRef}
      style={{
        border: 'none'
      }}
    />
  )
}

export default QuillContentRenderer
