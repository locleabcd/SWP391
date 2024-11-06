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
      // className='py-5 indent-8 lg:text-lg text-sm text-justify px-6'
      style={{
        padding: '1.25rem 1.5rem',
        textIndent: '2rem',
        fontSize: '0.9rem',
        textAlign: 'justify',
        background: 'transparent',
        border: 'none'
      }}
    />
  )
}

export default QuillContentRenderer
