import { useEffect, useRef } from 'react';

const QRCode = ({ 
  data, 
  size = 150, 
  className = '', 
  colorDark = '#000000', 
  colorLight = '#ffffff',
  ...props 
}) => {
  const qrRef = useRef(null);

  useEffect(() => {
    if (qrRef.current && data && window.QRCode) {
      // Clear any existing QR code
      qrRef.current.innerHTML = '';
      
      try {
        // Generate new QR code
        new window.QRCode(qrRef.current, {
          text: data,
          width: size,
          height: size,
          colorDark: colorDark,
          colorLight: colorLight,
          correctLevel: window.QRCode.CorrectLevel.H // High error correction
        });

        // Remove title attribute from all generated elements
        setTimeout(() => {
          const allElements = qrRef.current.querySelectorAll('*');
          allElements.forEach(element => {
            element.removeAttribute('title');
            element.removeAttribute('alt');
            // Also override any future attempts to set title
            Object.defineProperty(element, 'title', {
              set: function() {},
              get: function() { return ''; }
            });
          });
        }, 100);
      } catch (error) {
        console.error('Error generating QR code:', error);
        // Fallback: show text if QR code generation fails
        qrRef.current.innerHTML = `
          <div style="
            width: ${size}px; 
            height: ${size}px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            border: 2px dashed #ccc; 
            background: #f9f9f9;
            font-size: 12px;
            text-align: center;
            color: #666;
          ">
            QR Code<br/>Unavailable
          </div>
        `;
      }
    }
  }, [data, size, colorDark, colorLight]);

  if (!data) {
    return (
      <div 
        className={`flex items-center justify-center border-2 border-dashed border-gray-300 bg-gray-100 ${className}`}
        style={{ width: size, height: size }}
        {...props}
      >
        <span className="text-xs text-gray-500 text-center">
          No Data<br/>Available
        </span>
      </div>
    );
  }

  return (
    <div 
      ref={qrRef} 
      className={`qr-code-container ${className}`}
      style={{ 
        /* Disable browser tooltips completely */
        pointerEvents: 'auto',
        ...props.style
      }}
      title=""
      onMouseOver={(e) => {
        // Force remove title on every hover
        e.target.title = '';
        const allEls = e.currentTarget.querySelectorAll('*');
        allEls.forEach(el => el.title = '');
      }}
      {...props}
    />
  );
};

export default QRCode;
